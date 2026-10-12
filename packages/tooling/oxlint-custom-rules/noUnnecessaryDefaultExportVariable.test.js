import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import noUnnecessaryDefaultExportVariable from "./noUnnecessaryDefaultExportVariable.js";

// Setup SUT
RuleTester.describe = describe;
RuleTester.it = it;
const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: "ts" } },
});

// Exercise and verify
ruleTester.run(
  "no-unnecessary-default-export-variable",
  noUnnecessaryDefaultExportVariable,
  {
    valid: [
      {
        name: "allows a directly default-exported expression",
        code: "export default build();",
      },
      {
        name: "allows a default-exported function declaration",
        code: "export default function Thing() {}",
      },
      {
        name: "allows a default-exported class declaration",
        code: "export default class Thing {}",
      },
      {
        name: "allows a variable that is also used before the export",
        code: "const thing = build(); consume(thing); export default thing;",
      },
      {
        name: "allows a variable that is also used after the export",
        code: "const thing = build(); export default thing; consume(thing);",
      },
      {
        name: "allows a variable that is also referenced in a later type query",
        code: "const thing = build(); type Definition = typeof thing; export default thing;",
      },
      {
        name: "allows a variable that is referenced in an earlier type query",
        code: "type Definition = typeof thing; const thing = build(); export default thing;",
      },
      {
        name: "allows a variable referenced in its own initializer",
        code: "const thing = build(() => thing); export default thing;",
      },
      {
        name: "allows a variable whose initializer runs before other statements",
        code: "const thing = build(); sideEffect(); export default thing;",
      },
      {
        name: "allows a let variable",
        code: "let thing = build(); export default thing;",
      },
      {
        name: "allows a variable with a type annotation",
        code: "const thing: Definition = build(); export default thing;",
      },
      {
        name: "allows a variable declared together with another variable",
        code: "const thing = build(), other = build(); export default thing;",
      },
      {
        name: "allows a destructured variable",
        code: "const { thing } = build(); export default thing;",
      },
      {
        name: "allows a variable that is also exported by name",
        code: "const thing = build(); export { thing, thing as default };",
      },
      {
        name: "allows a variable that is not the default export",
        code: "const thing = build(); export { other as default } from './other';",
      },
      {
        name: "allows a variable exported as a type-only default",
        code: "const thing = build(); export type { thing as default };",
      },
      {
        name: "allows an arrow function variable",
        code: "const thing = () => 1; export default thing;",
      },
      {
        name: "allows an arrow function variable wrapped in a satisfies expression",
        code: "const thing = (() => 1) satisfies Function; export default thing;",
      },
      {
        name: "allows an anonymous function expression variable",
        code: "const thing = function () {}; export default thing;",
      },
      {
        name: "allows an anonymous class expression variable",
        code: "const thing = class {}; export default thing;",
      },
      {
        name: "allows a variable holding a function expression with a different name",
        code: "const thing = function Other() {}; export default thing;",
      },
      {
        name: "allows a variable aliasing another identifier",
        code: "const thing = Other; export default thing;",
      },
      {
        name: "allows a variable aliasing another identifier with a type assertion",
        code: "const thing = Other as Definition; export default thing;",
      },
      {
        name: "allows a variable that is also used inside a function",
        code: "const thing = {}; function read() { return thing; } export default thing;",
      },
    ],
    invalid: [
      {
        name: "reports a call result exported through a variable and inlines it",
        code: "const thing = build(); export default thing;",
        output: "export default (build()); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports an object exported through a variable and inlines it",
        code: "const thing = {}; export default thing;",
        output: "export default ({}); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports a variable exported as default through an export list and inlines it",
        code: "const thing = {}; export { thing as default };",
        output: "export default ({}); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports a variable exported as a string-named default and inlines it",
        code: 'const thing = {}; export { thing as "default" };',
        output: "export default ({}); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports a satisfies expression exported through a variable and inlines it",
        code: "const thing = {} satisfies Definition; export default thing;",
        output: "export default ({} satisfies Definition); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports a sequence expression exported through a variable and inlines it",
        code: "const thing = (first(), second()); export default thing;",
        output: "export default (first(), second()); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports a function expression named like its variable and inlines it",
        code: "const thing = function thing() {}; export default thing;",
        output: "export default (function thing() {}); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports a class expression named like its variable and inlines it",
        code: "const thing = class thing {}; export default thing;",
        output: "export default (class thing {}); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "keeps comments inside the initializer when inlining",
        code: "const thing = { /* keep */ value: 1 }; export default thing;",
        output: "export default ({ /* keep */ value: 1 }); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "keeps comments around both statements when inlining",
        code: "// doc\nconst thing = build();\n// export\nexport default thing;",
        output: "// doc\nexport default (build());\n// export\n",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports a variable whose name is only shadowed inside another function",
        code: "function other(thing) { return thing; } const thing = {}; export default thing;",
        output: "function other(thing) { return thing; } export default ({}); ",
        errors: [{ messageId: "unnecessary", data: { name: "thing" } }],
      },
      {
        name: "reports without fixing when a comment precedes the variable name",
        code: "const /* preserve */ thing = build(); export default thing;",
        output: null,
        errors: [{ messageId: "unnecessary" }],
      },
      {
        name: "reports without fixing when a comment is inside the export",
        code: "const thing = build(); export /* preserve */ default thing;",
        output: null,
        errors: [{ messageId: "unnecessary" }],
      },
    ],
  },
);
