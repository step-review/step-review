import { readdirSync } from "node:fs";
import { basename, dirname, extname } from "node:path";

const DEFAULT_MAXIMUM = 20;
const SOURCE_EXTENSIONS = new Set([
  ".cjs",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
]);
const TEST_FILE = /(?:^|\.)(?:spec|test)(?:\.|$)/u;

const isCountedFile = (entry) =>
  entry.isFile() &&
  SOURCE_EXTENSIONS.has(extname(entry.name)) &&
  !entry.name.endsWith(".d.ts") &&
  !TEST_FILE.test(entry.name);

const maxFilesPerFolder = {
  meta: {
    type: "suggestion",
    docs: { description: "Limit non-test source files in a folder." },
    schema: [
      {
        type: "object",
        properties: { max: { type: "integer", minimum: 1 } },
        additionalProperties: false,
      },
    ],
    messages: {
      tooMany:
        "Folder has {{fileCount}} non-test source files; the maximum is {{maximum}}.",
    },
  },
  create(context) {
    const maximum = context.options[0]?.max ?? DEFAULT_MAXIMUM;

    return {
      Program(node) {
        const directory = dirname(context.filename);
        const entries = readdirSync(directory, { withFileTypes: true });
        const files = entries.filter(isCountedFile).map((entry) => entry.name);
        files.sort((left, right) => left.localeCompare(right, "en"));
        if (files.length > maximum && basename(context.filename) === files[0]) {
          context.report({
            node,
            messageId: "tooMany",
            data: { fileCount: files.length, maximum },
          });
        }
      },
    };
  },
};

export default maxFilesPerFolder;
