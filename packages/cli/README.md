# @step-review/cli

Builds and checks [Step Review](https://step-review.dev) files. Coding agents
run it as instructed by [`SKILL.md`](../app/public/SKILL.md):

```sh
npx @step-review/cli build review.json --output pr-123.step-review
npx @step-review/cli check pr-123.step-review
```

Both commands exit with status 1 when the review has problems, and list them.

## Publishing

The `CLI` workflow publishes through npm trusted publishing:

- Every push to a branch publishes a beta, e.g.
  `0.1.0-beta.my-branch-1a2b3c4d.sha0123456789ab`, under a dist-tag named after
  the branch: `npx @step-review/cli@my-branch`.
- A `cli-vX.Y.Z` tag on main publishes `X.Y.Z` to `latest`. Add a `## X.Y.Z`
  section to `CHANGELOG.md`, then on a clean main run
  `pnpm --filter @step-review/cli release:prepare X.Y.Z`, and push main and the
  tag with `git push --atomic origin main cli-vX.Y.Z`.

QA builds and tests the tarball once; the publish job publishes that exact
tarball. Re-running a job is safe: an already published version with the same
content is skipped.
