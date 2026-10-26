Step Review helps you review large PRs and actually understand them. This way,
you keep a handle on your codebase even when coding agents produce mountains of
code that you can't realistically review line by line.

Your agent doesn't review the PR for you: it just prepares it for you. It splits
the changes into logical steps, explains the parts that aren't obvious, points
out possible issues, and focuses your attention on the most important aspects.

## Quickstart

1. You tell your coding agent to review your PR with the
   [step-review skill](https://step-review.dev/SKILL.md).
2. Your agent does that and writes a review file in your repository
   (uncommitted).
3. You open the file in [step-review.dev](https://step-review.dev) and go
   through the PR one step at a time, with the notes beside the diff.

You can also review a PR with others: just start a collaboration session with
the collaboration button in the sidebar and share the link.

## Under the hood

Step Review defines a simple format for the "review explainer", made of:

- An overview: what the PR does, and how to read it.
- Steps: groups of changes to read together, in order, each with a short intro
  and an attention level (high, normal or low).
- Notes, anchored to lines of the diff, to files or to steps: explainers for the
  non-obvious parts, and issues to check, each with a severity.
- The PR's `git diff`, which the notes point into.

The format is versioned and has a JSON Schema; see
[`@step-review/review-format`](packages/review-format/README.md).

Then, Step Review's [SKILL.md](packages/app/public/SKILL.md) (published at
`step-review.dev/SKILL.md`):

- Teaches the agent the format.
- Tells it how to prepare the review: how to split the changes into steps, and
  what deserves a note.
- Tells it to build the review file with
  [`@step-review/cli`](packages/cli/README.md), which reports the problems the
  app would show, and to write it in your repository, without committing it.

## Development

pnpm monorepo:

- [`packages/app`](packages/app): the web app (Vite, React, Primer).
- [`packages/cli`](packages/cli): the CLI that agents use to build and check
  review files, published as `@step-review/cli`.
- [`packages/review-format`](packages/review-format): the review file format:
  schemas, parser and consistency checks.
- [`packages/session-server`](packages/session-server): the server of sessions
  (a Cloudflare Worker with Durable Objects), and its protocol.
- [`packages/tooling/oxlint-custom-rules`](packages/tooling/oxlint-custom-rules):
  architecture lint rules.
- [`packages/tooling/release`](packages/tooling/release): the scripts that
  prepare releases and publish the packages.

See [Setup](docs/setup.md) for requirements, commands and deployment.
Contributors and coding agents follow the principles in
[`AGENTS.md`](AGENTS.md).

## License

[MIT](LICENSE)
