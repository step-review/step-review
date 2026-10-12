import { basename, extname } from "node:path";

const unwrapName = (node) => {
  if (node?.type === "Identifier") {
    return node.name;
  }
  if (node?.id?.type === "Identifier") {
    return node.id.name;
  }
  const wrappers = new Set([
    "ChainExpression",
    "ParenthesizedExpression",
    "TSAsExpression",
    "TSNonNullExpression",
    "TSSatisfiesExpression",
    "TSTypeAssertion",
  ]);
  return wrappers.has(node?.type) ? unwrapName(node.expression) : undefined;
};

const exportedName = (specifier) => {
  const exported = specifier.exported;
  const isDefault =
    (exported.type === "Identifier" && exported.name === "default") ||
    exported.value === "default";
  return isDefault ? unwrapName(specifier.local) : undefined;
};

const logicalFilename = (filename) => {
  const sourceStem = basename(filename, extname(filename));
  return sourceStem.endsWith(".css")
    ? sourceStem.slice(0, -".css".length)
    : sourceStem;
};

const filenameMatchesDefaultExport = {
  meta: {
    type: "problem",
    docs: { description: "Match a default export name to its filename." },
    schema: [],
    messages: {
      mismatch:
        "Default export must be named '{{filename}}' to match the filename exactly.",
    },
  },
  create(context) {
    let defaultExportName;

    return {
      ExportDefaultDeclaration(node) {
        defaultExportName = unwrapName(node.declaration);
      },
      ExportNamedDeclaration(node) {
        for (const specifier of node.specifiers) {
          defaultExportName ??= exportedName(specifier);
        }
      },
      "Program:exit"(node) {
        if (defaultExportName === undefined) {
          return;
        }
        const filename = logicalFilename(context.filename);
        if (defaultExportName !== filename) {
          context.report({
            node,
            messageId: "mismatch",
            data: { filename },
          });
        }
      },
    };
  },
};

export default filenameMatchesDefaultExport;
