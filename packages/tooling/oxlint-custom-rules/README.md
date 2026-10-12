# Architecture lint rules

Private workspace package loaded by `.oxlintrc.architecture.json` through
`@step-review/oxlint-custom-rules`. The rules are plain JavaScript and need no
build.

| Rule                                     | What it checks                                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filename-matches-default-export`        | Named default exports match the filename; anonymous expressions are allowed. `App.css.ts` uses `App`.                                            |
| `no-unnecessary-default-export-variable` | Prefer direct default exports over adjacent, export-only `const` bindings. Offers safe autofixes.                                                |
| `max-files-per-folder`                   | At most 20 direct JS/TS files, excluding declarations and test/spec files.                                                                       |
| `max-lines`                              | At most 250 physical lines, including comments and blank lines. Filenames containing `.test.` are always excluded.                               |
| `public-exports`                         | Package `src/index.ts` entrypoints expose named exports only. Other files allow no exports or one default export. CommonJS exports are rejected. |
| `component-named-props`                  | Function components in TSX files use named props types, with interfaces preferred by the existing TypeScript rule.                               |

Rules apply to package `dev`, `src`, and `scripts` directories, including tests
and executable test helpers. Declarations, generated files, compiled
translations, build outputs, configuration files, and this plugin's tooling are
outside their scope. Nested `index.ts` files follow the ordinary
single-default-export rule.

The component props rule checks functions with uppercase names, including local
components, and anonymous default functions in files with uppercase names. It
accepts named interfaces and type aliases, including unions, imported types, and
generic props. Components without parameters need no props declaration. React's
`FC`, `FunctionComponent`, `memo`, and `forwardRef` can supply the named props
type through their type arguments. Lowercase helpers and JSX callbacks are
outside its scope. It does not offer autofixes.

The direct-export rule uses scope references, including TypeScript type
references, to distinguish export-only bindings from reused ones. It accepts
both `export default value` and `export { value as default }`. It leaves
nonadjacent declarations, multiple bindings, destructuring, mutable variables,
and explicitly typed bindings alone. It also preserves aliases and inferred
function/class names. Autofixes retain the initializer's execution position and
comments; comments attached inside the binding itself require a manual fix.

```ts
// Prefer
export default defineSchema({});

// Keep a binding when it is also used locally
const schema = defineSchema({});
type Definition = InferOutput<typeof schema>;
export default schema;
```

Run the rule tests with `pnpm --filter @step-review/oxlint-custom-rules test`.
Run only architecture checks with
`pnpm exec oxlint -c .oxlintrc.architecture.json --deny-warnings .`. Keep any
future project-specific exceptions in the root configuration.
