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
`/schema/v1.json`.

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
GitHub Actions deploy:

- `main` to `https://step-review.dev` (`.github/workflows/main.yml`);
- each internal PR to `https://pr-<number>.step-review.dev`, removed when the PR
  closes (`pull-requests.yml`, `cleanup-preview.yml`).

One-time setup:

- Add the `step-review.dev` zone to the Cloudflare account. Deploys create the
  custom domains for the Workers.
- Create an API token with the _Workers Scripts: Edit_, _Workers Routes: Edit_
  and _Zone: Read_ permissions (for the account and the zone), and add the
  repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

To deploy by hand, export the same variables and run `pnpm build`, then
`pnpm deploy-site --main` or `pnpm deploy-site --pr <number>`.
