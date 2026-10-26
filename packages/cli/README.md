# @step-review/cli

Builds and checks [Step Review](https://step-review.dev) files. Coding agents
run it as instructed by [`SKILL.md`](../app/public/SKILL.md):

```sh
npx @step-review/cli build review.json --output pr-123.step-review
npx @step-review/cli check pr-123.step-review
```

Both commands exit with status 1 when the review has problems, and list them.

## Publishing

The `Publish CLI` workflow publishes the package to npm when a `cli-v<version>`
tag is pushed. Bump `version` in `package.json` first; the tag must match it.
