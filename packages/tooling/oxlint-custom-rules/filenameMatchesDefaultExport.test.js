import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import filenameMatchesDefaultExport from "./filenameMatchesDefaultExport.js";

// Setup SUT
RuleTester.describe = describe;
RuleTester.it = it;
const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: "ts" } },
});

// Exercise and verify
ruleTester.run(
  "filename-matches-default-export",
  filenameMatchesDefaultExport,
  {
    valid: [
      {
        name: "allows an anonymous default-exported object",
        filename: "Thing.ts",
        code: "export default {};",
      },
      {
        name: "allows a default-exported call result",
        filename: "Thing.ts",
        code: "export default build();",
      },
      {
        name: "allows a default-exported arrow function",
        filename: "Thing.ts",
        code: "export default () => 1;",
      },
      {
        name: "allows an anonymous default-exported function",
        filename: "Thing.ts",
        code: "export default function () {}",
      },
      {
        name: "allows an anonymous default-exported class",
        filename: "Thing.ts",
        code: "export default class {}",
      },
      {
        name: "allows a default-exported satisfies expression",
        filename: "Thing.ts",
        code: "export default {} satisfies Record<string, unknown>;",
      },
      {
        name: "allows a default-exported function named after the file",
        filename: "Thing.ts",
        code: "export default function Thing() {}",
      },
      {
        name: "allows a default-exported class named after the file",
        filename: "Thing.ts",
        code: "export default class Thing {}",
      },
      {
        name: "allows a default-exported variable named after the file",
        filename: "Thing.ts",
        code: "const Thing = 1; export default Thing;",
      },
      {
        name: "allows a CSS module whose default export is named after the file without its .css suffix",
        filename: "App.css.ts",
        code: "const App = {}; export default App;",
      },
      {
        name: "allows a file without exports",
        filename: "NoExports.ts",
        code: "const internal = 1;",
      },
      {
        name: "allows a package entrypoint that re-exports defaults by name",
        filename: "packages/core/example/src/index.ts",
        code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
      },
    ],
    invalid: [
      {
        name: "reports a default-exported variable not named after the file",
        filename: "Thing.ts",
        code: "const Other = 1; export default Other;",
        errors: [{ messageId: "mismatch" }],
      },
      {
        name: "reports a default-exported function not named after the file",
        filename: "Thing.ts",
        code: "export default function Other() {};",
        errors: [{ messageId: "mismatch" }],
      },
      {
        name: "reports a CSS module whose default export is not named after the file without its .css suffix",
        filename: "App.css.ts",
        code: "const Styles = {}; export default Styles;",
        errors: [{ messageId: "mismatch", data: { filename: "App" } }],
      },
    ],
  },
);
