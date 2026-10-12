<img src="packages/app/public/favicon.svg" alt="" width="64" height="64">

# step-review

Review big pull requests step by step, with notes from your coding agent.

Your coding agent splits a PR into steps (by part of the system, by concern,
mechanical changes apart…) and writes notes on the changes: explainers for the
non-obvious parts, and issues to check. step-review shows the review one step at
a time, with the notes beside the diff, and lets you mark files as viewed,
accept or dismiss issues, and comment on lines. Your feedback goes back to the
agent as Markdown.

## How it works

1. Open [step-review.dev](https://step-review.dev), enter the PR link (or a
   branch, or a commit range), and copy the generated prompt.
2. Give the prompt to your coding agent. Following
   [SKILL.md](packages/app/public/SKILL.md) (published at
   `step-review.dev/SKILL.md`), it writes a single review file, such as
   `pr-123.step-review`, in your repository. The file is never committed.
3. Drop the file into step-review. Everything stays in your browser.
4. When the PR changes, ask the agent for a new round: it appends to the same
   file, and the app shows what changed since your last review.

## Review files

A review file is a sequence of rounds. Each round is a JSON section written by
the agent (overview, steps, notes) followed by the `git diff` of the PR, so the
agent never writes diff content itself. See
[`@step-review/review-format`](packages/review-format/README.md) for the format,
and `step-review.dev/schema/v1.json` for its JSON Schema.

## Development

pnpm monorepo:

- [`packages/app`](packages/app): the web app (Vite, React, Mantine).
- [`packages/review-format`](packages/review-format): the review file format:
  schemas, parser and consistency checks.
- [`packages/tooling/oxlint-custom-rules`](packages/tooling/oxlint-custom-rules):
  architecture lint rules.

See [Setup](docs/setup.md) for requirements, commands and deployment.
Contributors and coding agents follow the principles in
[`AGENTS.md`](AGENTS.md).

## License

[MIT](LICENSE)
