const defaultIdentifier = (statement) => {
  if (statement.type === "ExportDefaultDeclaration") {
    return statement.declaration.type === "Identifier"
      ? statement.declaration
      : undefined;
  }
  if (
    statement.type === "ExportNamedDeclaration" &&
    !statement.source &&
    statement.exportKind !== "type" &&
    statement.specifiers.length === 1
  ) {
    const specifier = statement.specifiers[0];
    const name = specifier.exported.name ?? specifier.exported.value;
    if (name === "default" && specifier.exportKind !== "type") {
      return specifier.local;
    }
  }
  return undefined;
};

const noUnnecessaryDefaultExportVariable = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Export definitions directly when a const binding is unnecessary.",
    },
    fixable: "code",
    schema: [],
    messages: {
      unnecessary:
        "Default export the definition directly instead of introducing '{{name}}' solely for the export.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      "Program:exit"(program) {
        for (let index = 1; index < program.body.length; index++) {
          const statement = program.body[index];
          const identifier = defaultIdentifier(statement);
          const declaration = program.body[index - 1];
          if (
            !identifier ||
            declaration.type !== "VariableDeclaration" ||
            declaration.kind !== "const" ||
            declaration.declarations.length !== 1
          ) {
            continue;
          }
          const binding = declaration.declarations[0];
          const initializer = binding.init;
          if (
            binding.id.type !== "Identifier" ||
            binding.id.name !== identifier.name ||
            binding.id.typeAnnotation ||
            !initializer
          ) {
            continue;
          }
          let definition = initializer;
          while (
            [
              "ParenthesizedExpression",
              "TSAsExpression",
              "TSSatisfiesExpression",
              "TSNonNullExpression",
              "TSTypeAssertion",
            ].includes(definition.type)
          ) {
            definition = definition.expression;
          }
          // Preserve inferred runtime names and filename-compatible aliases.
          if (
            definition.type === "Identifier" ||
            definition.type === "ArrowFunctionExpression" ||
            ((definition.type === "FunctionExpression" ||
              definition.type === "ClassExpression") &&
              definition.id?.name !== binding.id.name)
          ) {
            continue;
          }
          const [variable] = sourceCode.getDeclaredVariables(binding);
          if (
            !variable ||
            variable.references.some(
              ({ identifier: reference }) =>
                reference !== identifier && reference !== binding.id,
            )
          ) {
            continue;
          }
          const hasBindingComments = sourceCode
            .getCommentsInside(declaration)
            .some(
              (comment) =>
                comment.range[0] < initializer.range[0] ||
                comment.range[1] > initializer.range[1],
            );
          context.report({
            node: binding.id,
            messageId: "unnecessary",
            data: { name: binding.id.name },
            fix:
              hasBindingComments ||
              sourceCode.getCommentsInside(statement).length > 0
                ? undefined
                : (fixer) => [
                    fixer.replaceText(
                      declaration,
                      `export default (${sourceCode.getText(initializer)});`,
                    ),
                    fixer.remove(statement),
                  ],
          });
        }
      },
    };
  },
};

export default noUnnecessaryDefaultExportVariable;
