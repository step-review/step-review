# Setup

## System requirements

- [Node.js 24](https://nodejs.org/en/).
- [Corepack](https://github.com/nodejs/corepack), to install pnpm. Make sure it
  is enabled by running `corepack enable`.

## First time setup

After cloning the repository:

- Run `pnpm install`.
- Run `pnpm --filter @step-review/app exec playwright install chromium` to
  install Chromium for the component tests.

## Local development

Run `pnpm dev` and open the URL printed by Vite (normally
`http://127.0.0.1:5173`). The dev server also serves `/SKILL.md` and
`/schema/v3.json`, and proxies `/api/` to the session server, which `pnpm dev`
runs locally with Wrangler on port 8787 (`SESSION_SERVER_PORT` changes it). Its
sessions are kept in `packages/session-server/.wrangler`.

To try the app, have a coding agent write a review of any repository (see
`packages/app/public/SKILL.md`), then drop the file on the start page.

## `package.json` scripts

From the repository root:

- `pnpm dev`: start the app.
- `pnpm build`: build the app into `packages/app/dist`.
- `pnpm lint` / `pnpm lint-fix`
- `pnpm check-formatting` / `pnpm fix-formatting`
- `pnpm check-translations`: check that the message catalogs are up to date.
  After changing user-visible text, run
  `pnpm --filter @step-review/app translations:extract` and
  `pnpm --filter @step-review/app translations:compile`.
- `pnpm check-types`
- `pnpm test`
- `pnpm qa`: all of the above checks.
- `pnpm --filter <package> <script>`: run a package's script.

## Editor setup

Install the oxc extension for your editor (see
[instructions](https://oxc.rs/docs/guide/usage/linter/editors.html)) to see
linting errors in the editor, and configure it to format on save.

## Deployment

The app is a static site, deployed to Cloudflare as a Worker with static assets.
The same Worker runs the session server for the requests under `/api/`: the
deploy script merges `packages/session-server/wrangler.json` into the app's
configuration. Each Worker has its own Durable Objects, so PR previews don't
share data with production. GitHub Actions deploy:

- each release tag (`vX.Y.Z`) to `https://step-review.dev`, see
  [Releasing](#releasing);
- each internal PR to `https://pr-<number>.step-review.dev`, removed when the PR
  closes (`ci.yml`, `cleanup-preview.yml`).

One-time setup:

- Add the `step-review.dev` zone to the Cloudflare account. Deploys create the
  custom domains for the Workers.
- Create an API token with the _Workers Scripts: Edit_, _Workers Routes: Edit_
  and _Zone: Read_ permissions (for the account and the zone), and add the
  repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

To deploy by hand, export the same variables and run `pnpm build`, then
`pnpm deploy-site --production` or `pnpm deploy-site --pr <number>`.

## Releasing

All packages share one version. A `vX.Y.Z` tag on `main` deploys the app to
production and publishes the CLI to npm with the `latest` dist-tag. Every push
to a branch also publishes a CLI beta, under a dist-tag named after the branch.

1. Add a `## X.Y.Z` section to [`CHANGELOG.md`](../CHANGELOG.md) and commit it.
2. On a clean `main`, run `pnpm release:prepare X.Y.Z`: it sets the version of
   every package, runs QA, commits and tags.
3. Push both: `git push --atomic origin main vX.Y.Z`.

The CLI is published through npm trusted publishing: no token. QA builds and
tests its tarball once; the publish job publishes that exact tarball, and skips
a version already published with the same content, so re-running a job is safe.

One-time setup: publish the first version of `@step-review/cli` by hand
(`pnpm --filter @step-review/cli build`, then `pnpm publish --access public` in
`packages/cli`), then register the repository's `ci.yml` workflow as its trusted
publisher on npm. Branch betas are skipped until then, since npm makes a
package's first version `latest`.
