import { basename } from "node:path";

const DEFAULT_MAXIMUM = 200;

const maxLines = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Limit non-test source files to a maximum number of lines.",
    },
    schema: [
      {
        type: "object",
        properties: { max: { type: "integer", minimum: 1 } },
        additionalProperties: false,
      },
    ],
    messages: {
      tooLong: "File has {{lineCount}} lines; the maximum is {{maximum}}.",
    },
  },
  create(context) {
    if (basename(context.filename).includes(".test.")) {
      return {};
    }

    const maximum = context.options[0]?.max ?? DEFAULT_MAXIMUM;

    return {
      Program(node) {
        const lineCount = context.sourceCode.lines.length;
        if (lineCount > maximum) {
          context.report({
            node,
            messageId: "tooLong",
            data: { lineCount, maximum },
          });
        }
      },
    };
  },
};

export default maxLines;
