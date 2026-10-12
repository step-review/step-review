import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import publicExports from "./publicExports.js";

// Setup SUT
RuleTester.describe = describe;
RuleTester.it = it;
const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { lang: "ts" } },
});

// Exercise and verify
ruleTester.run("public-exports", publicExports, {
  valid: [
    {
      name: "allows a module without exports",
      code: "const internal = 1;",
    },
    {
      name: "allows a single default export",
      code: "const Thing = 1; export default Thing;",
    },
    {
      name: "allows a default-exported namespace merged with an interface",
      code: "namespace Thing { export class Failure extends Error {} } interface Thing { run(): void; } export default Thing;",
    },
    {
      name: "allows a default-exported namespace with nested exports",
      code: "namespace Thing { export namespace Nested { export interface Options {} } } export default Thing;",
    },
    {
      name: "allows a namespace with exports that is not exported",
      code: "namespace Thing { export class Internal {} }",
    },
    {
      name: "allows default re-exports by name in a core package entrypoint",
      filename: "packages/core/entity-detector/src/index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows default re-exports by name in another core package entrypoint",
      filename: "packages/core/levenshtein-entity-detector/src/index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows default re-exports by name in a third core package entrypoint",
      filename: "packages/core/llm-entity-detector/src/index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows default re-exports by name in a public client package entrypoint",
      filename: "packages/public/client/src/index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows default re-exports by name in a public server package entrypoint",
      filename: "packages/public/server/src/index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows default re-exports by name in a benchmark package entrypoint",
      filename: "packages/benchmarks/llm-entity-detector/src/index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows default re-exports by name in a top-level package entrypoint",
      filename: "packages/demo/src/index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows default re-exports by name in the entrypoint of a new package group",
      filename: "packages/future/new-package/src/index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows default re-exports by name in a package entrypoint with a Windows path",
      filename: "C:\\repo\\packages\\core\\entity-detector\\src\\index.ts",
      code: 'export { default as Thing } from "./Thing.ts"; export type { default as Options } from "./Options.ts";',
    },
    {
      name: "allows a package entrypoint without exports",
      filename: "packages/core/example/src/index.ts",
      code: "const internal = 1;",
    },
    {
      name: "allows named declarations in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: "export class Thing {} export interface Options {}",
    },
    {
      name: "allows star re-exports in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: 'export * from "./Thing.ts";',
    },
    {
      name: "allows namespace re-exports in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: 'export * as Things from "./Thing.ts";',
    },
  ],
  invalid: [
    {
      name: "reports a named export",
      code: "export const named = 1;",
      errors: [{ messageId: "invalidExports" }],
    },
    {
      name: "reports an exported namespace",
      code: "export namespace Thing { export class Failure extends Error {} }",
      errors: [{ messageId: "invalidExports" }],
    },
    {
      name: "reports a named export next to a default export",
      code: "namespace Thing { export class Failure extends Error {} } export default Thing; export const named = 1;",
      errors: [{ messageId: "invalidExports" }],
    },
    {
      name: "reports exporting the default-exported value by name as well",
      code: "const Thing = 1; export default Thing; export { Thing };",
      errors: [{ messageId: "invalidExports" }],
    },
    {
      name: "reports a CommonJS export",
      code: "module.exports = {};",
      errors: [{ messageId: "invalidExports" }],
    },
    {
      name: "reports a default-exported class in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: "export default class Thing {}",
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports a default-exported variable in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: "const Thing = 1; export default Thing;",
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports re-exporting a default as the default in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: 'export { default } from "./Thing.ts";',
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports re-exporting a default both by name and as the default in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: 'export { default as Thing, default } from "./Thing.ts";',
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports re-exporting a named export as the default in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: 'export { Thing as default } from "./Thing.ts";',
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports re-exporting a named export as a string-named default in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: 'export { Thing as "default" } from "./Thing.ts";',
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports exporting a variable as the default through an export list in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: "const Thing = 1; export { Thing as default };",
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports a type-only default re-export in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: 'export type { Options as default } from "./Options.ts";',
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports a namespace re-export as the default in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: 'export * as default from "./Thing.ts";',
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports a CommonJS export in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: "module.exports = {};",
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports a CommonJS named export in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: "exports.Thing = 1;",
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports a TypeScript export assignment in a package entrypoint",
      filename: "packages/core/example/src/index.ts",
      code: "const Thing = {}; export = Thing;",
      errors: [{ messageId: "invalidEntrypointExports" }],
    },
    {
      name: "reports default re-exports by name in a nested index file",
      filename: "packages/core/example/src/utils/index.ts",
      code: 'export { default as Thing } from "./Thing.ts";',
      errors: [{ messageId: "invalidExports" }],
    },
    {
      name: "reports default re-exports by name in a non-index source file",
      filename: "packages/core/example/src/Thing.ts",
      code: 'export { default as Thing } from "./Thing.ts";',
      errors: [{ messageId: "invalidExports" }],
    },
    {
      name: "reports default re-exports by name in an index file outside a package",
      filename: "scripts/index.ts",
      code: 'export { default as Thing } from "./Thing.ts";',
      errors: [{ messageId: "invalidExports" }],
    },
  ],
});
