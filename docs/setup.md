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
- `pnpm build`: build every package.
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
share data with production.

GitHub Actions run QA (`_qa.yml`) on every PR, on every push to `main`
(`main.yml`) and on every release tag. After it passes:

- each internal PR is deployed to `https://pr-<number>.step-review.dev`, removed
  when the PR closes, and its public packages are published under the
  `pr-<number>` dist-tag (`pull-requests.yml`, `pull-requests-closed.yml`);
- each release tag (`vX.Y.Z`) is deployed to `https://step-review.dev` and its
  public packages are published under `latest` (`tags.yml`), see
  [Releasing](#releasing).

One-time setup:

- Add the `step-review.dev` zone to the Cloudflare account. Deploys create the
  custom domains for the Workers.
- Create an API token with the _Workers Scripts: Edit_, _Workers Routes: Edit_
  and _Zone: Read_ permissions (for the account and the zone), and add the
  repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

To deploy by hand, export the same variables and run `pnpm build`, then
`pnpm deploy-site --production` or `pnpm deploy-site --pr <number>`.

## Releasing

All packages share one version, released by a `vX.Y.Z` tag on `main`.

1. Add a `## X.Y.Z` section to [`CHANGELOG.md`](../CHANGELOG.md), in a PR.
2. On a clean `main`, run `pnpm release:prepare X.Y.Z`: it sets the version of
   every package, runs QA, commits and tags.
3. Push both: `git push --atomic origin main vX.Y.Z`. Pushing to `main` without
   a PR needs the bypass of its ruleset, which repository admins have.

Packages are published through npm trusted publishing: no token. Re-running a
job skips the versions already published.

One-time setup for each new public package: npm only trusts publishers of
packages that exist, so publish its first version by hand, with `npm login`,
then `pnpm build` and `pnpm release:publish --production`. Then, in the
package's settings on npm, add the repository's `pull-requests.yml` and
`tags.yml` workflows as trusted publishers, allowing `npm publish`, and require
two-factor authentication and disallow tokens. PR previews are skipped until the
first version exists, since npm makes a package's first version `latest`.

The `main` ruleset requires the QA check, which GitHub names `qa / qa` after the
calling job and the job of `_qa.yml`: renaming either job means updating the
ruleset.
