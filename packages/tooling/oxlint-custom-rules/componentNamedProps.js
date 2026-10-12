import { basename, extname } from "node:path";

const componentNamedProps = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require named types for function component props.",
    },
    schema: [],
    messages: {
      named:
        "Declare component props in a named type, preferably an interface.",
    },
  },
  create(context) {
    const reactImportName = (node) => {
      if (node?.type === "MemberExpression" && !node.computed) {
        return reactImportName(node.object) === "*"
          ? node.property.name
          : undefined;
      }
      if (node?.type === "TSQualifiedName") {
        return reactImportName(node.left) === "*" ? node.right.name : undefined;
      }
      if (node?.type !== "Identifier") {
        return undefined;
      }
      let scope = context.sourceCode.getScope(node);
      while (scope) {
        const variable = scope.set.get(node.name);
        if (variable) {
          const definition = variable.defs[0];
          if (
            definition?.type === "ImportBinding" &&
            definition.parent.source.value === "react"
          ) {
            return definition.node.type === "ImportSpecifier"
              ? definition.node.imported.name
              : "*";
          }
          return undefined;
        }
        scope = scope.upper;
      }
      return undefined;
    };

    const functionComponentPropsType = (typeAnnotation) =>
      typeAnnotation?.type === "TSTypeReference" &&
      ["FC", "FunctionComponent"].includes(
        reactImportName(typeAnnotation.typeName),
      )
        ? typeAnnotation.typeArguments?.params[0]
        : undefined;

    const checkFunction = (node) => {
      let current = node;
      let name = node.id?.name;
      let contextualPropsType;
      while (current.parent) {
        const parent = current.parent;
        if (
          [
            "ParenthesizedExpression",
            "TSAsExpression",
            "TSSatisfiesExpression",
            "TSNonNullExpression",
            "TSTypeAssertion",
          ].includes(parent.type)
        ) {
          contextualPropsType ??= functionComponentPropsType(
            parent.typeAnnotation,
          );
          current = parent;
        } else if (
          parent.type === "CallExpression" &&
          parent.arguments[0] === current &&
          ["memo", "forwardRef"].includes(reactImportName(parent.callee))
        ) {
          const typeArguments = parent.typeArguments?.params;
          contextualPropsType ??=
            typeArguments?.[
              reactImportName(parent.callee) === "forwardRef" ? 1 : 0
            ];
          current = parent;
        } else {
          break;
        }
      }
      if (current.parent?.type === "VariableDeclarator") {
        const identifier = current.parent.id;
        name = identifier.name;
        contextualPropsType ??= functionComponentPropsType(
          identifier.typeAnnotation?.typeAnnotation,
        );
      } else if (current.parent?.type === "ExportDefaultDeclaration") {
        name ??= basename(context.filename, extname(context.filename));
      }
      if (!name || !/^[A-Z]/.test(name) || node.params.length === 0) {
        return;
      }
      const parameter =
        node.params[0].type === "AssignmentPattern"
          ? node.params[0].left
          : node.params[0];
      let propsType = parameter.typeAnnotation?.typeAnnotation;
      propsType ??= contextualPropsType;
      while (propsType?.type === "TSParenthesizedType") {
        propsType = propsType.typeAnnotation;
      }
      if (propsType?.type !== "TSTypeReference") {
        context.report({
          node: parameter.typeAnnotation ?? parameter,
          messageId: "named",
        });
      }
    };

    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };
  },
};

export default componentNamedProps;
