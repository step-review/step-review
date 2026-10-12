import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import maxLines from "./maxLines.js";

// Setup SUT
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

// Exercise and verify
ruleTester.run("max-lines", maxLines, {
  valid: [
    {
      name: "allows a file at the default limit of 200 lines",
      code: Array(200).fill("void 0;").join("\n"),
    },
    {
      name: "allows a file at a configured limit",
      code: "const first = 1;\nconst second = 2;",
      options: [{ max: 2 }],
    },
    {
      name: "ignores a test file over the default limit",
      filename: "example.test.js",
      code: Array(201).fill("void 0;").join("\n"),
    },
    {
      name: "ignores a test file over a configured limit",
      filename: "example.test.tsx",
      code: "const first = 1;\nconst second = 2;\nvoid first;",
      options: [{ max: 2 }],
    },
  ],
  invalid: [
    {
      name: "reports a file over the default limit inside a folder whose name contains .test.",
      filename: "example.test.directory/example.ts",
      code: Array(201).fill("void 0;").join("\n"),
      errors: [
        { messageId: "tooLong", data: { lineCount: 201, maximum: 200 } },
      ],
    },
    {
      name: "reports a spec file over a configured limit",
      filename: "example.spec.ts",
      code: "const first = 1;\nconst second = 2;\nvoid first;",
      options: [{ max: 2 }],
      errors: [{ messageId: "tooLong" }],
    },
  ],
});
