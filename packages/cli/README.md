# @step-review/cli

Builds and checks [Step Review](https://step-review.dev) files. Coding agents
run it as instructed by [`SKILL.md`](../app/public/SKILL.md):

```sh
npx @step-review/cli build review.json --output pr-123.step-review
npx @step-review/cli check pr-123.step-review
```

Both commands exit with status 1 when the review has problems, and list them.

Agents' permission checks can block running a package that isn't installed. To
avoid that, install the CLI globally with your package manager
(`npm install --global`, `pnpm add --global`, `bun add --global`), and the
agents run the `step-review` command instead:

```sh
npm install --global @step-review/cli
```

## Publishing

Every PR publishes a preview under the `pr-<number>` dist-tag (the PR's comment
shows the exact version to run), and every release publishes to `latest`. See
[Releasing](../../docs/setup.md#releasing).
