const isIdentifier = (node, name) =>
  node?.type === "Identifier" && node.name === name;

const memberName = (node) => {
  if (!node.computed && node.property.type === "Identifier") {
    return node.property.name;
  }
  return node.property.type === "Literal" ? node.property.value : undefined;
};

const isCommonJsExport = (node) => {
  if (node?.type !== "MemberExpression") {
    return false;
  }
  if (isIdentifier(node.object, "exports")) {
    return true;
  }
  if (isIdentifier(node.object, "module") && memberName(node) === "exports") {
    return true;
  }
  return isCommonJsExport(node.object);
};

const exportedName = (specifier) =>
  specifier.exported.type === "Identifier"
    ? specifier.exported.name
    : specifier.exported.value;

const publicExports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require named exports in package entrypoints and a single default elsewhere.",
    },
    schema: [],
    messages: {
      invalidExports:
        "A file may have no exports or exactly one default export, with no other public exports.",
      invalidEntrypointExports:
        "A package src/index.ts may only expose named exports; default and CommonJS exports are not allowed.",
    },
  },
  create(context) {
    const isPackageIndex =
      /(?:^|\/)packages\/(?:[^/]+\/)+src\/index\.ts$/u.test(
        context.filename.replaceAll("\\", "/"),
      );
    let defaultExportCount = 0;
    let hasOtherExport = false;
    let hasCommonJsExport = false;

    return {
      ExportDefaultDeclaration(node) {
        if (node.parent.type !== "Program") {
          return;
        }
        defaultExportCount += 1;
      },
      ExportNamedDeclaration(node) {
        if (node.parent.type !== "Program") {
          return;
        }
        if (node.declaration) {
          hasOtherExport = true;
        }
        for (const specifier of node.specifiers) {
          if (exportedName(specifier) === "default") {
            defaultExportCount += 1;
          } else {
            hasOtherExport = true;
          }
        }
      },
      ExportAllDeclaration(node) {
        if (node.parent.type !== "Program") {
          return;
        }
        if (node.exported && exportedName(node) === "default") {
          defaultExportCount += 1;
        } else {
          hasOtherExport = true;
        }
      },
      AssignmentExpression(node) {
        if (isCommonJsExport(node.left)) {
          hasOtherExport = true;
          hasCommonJsExport = true;
        }
      },
      TSExportAssignment() {
        hasOtherExport = true;
        hasCommonJsExport = true;
      },
      "Program:exit"(node) {
        if (isPackageIndex) {
          if (defaultExportCount > 0 || hasCommonJsExport) {
            context.report({
              node,
              messageId: "invalidEntrypointExports",
            });
          }
          return;
        }
        const hasExports = defaultExportCount > 0 || hasOtherExport;
        if (hasExports && (defaultExportCount !== 1 || hasOtherExport)) {
          context.report({ node, messageId: "invalidExports" });
        }
      },
    };
  },
};

export default publicExports;
