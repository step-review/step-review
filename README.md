<img src="packages/app/public/favicon.svg" alt="" width="64" height="64">

# Step Review

A better way to review PRs.

Your coding agent splits a PR into steps (by part of the system, by concern,
mechanical changes apart…) and writes notes on the changes: explainers for the
non-obvious parts, and issues to check. Step Review shows the review one step at
a time, with the notes beside the diff, and lets you mark files as viewed.

## How it works

1. Open [step-review.dev](https://step-review.dev) and paste the PR link (or a
   branch, or a commit range) into the prompt. The app copies the completed
   prompt for you.
2. Give the prompt to your coding agent. Following
   [SKILL.md](packages/app/public/SKILL.md) (published at
   `step-review.dev/SKILL.md`), it writes a single review file, such as
   `pr-123.step-review`, in your repository. The file is never committed.
3. Drop the file into Step Review. Everything stays in your browser.
4. When the PR changes, ask the agent to review it again. Files whose changes
   are the same stay marked as viewed.

## Live collaboration

From a review's menu, start a live collaboration session to review it with
others. The review is encrypted in your browser and uploaded with a key that
only its link holds, so the server can't read it. Participants see each other's
names, the files each viewed, and the step each is on, live. Whoever started the
session can update the review by dropping a new review file, or end the session.
Sessions are deleted after 30 days without activity.

## Review files

A review file is a JSON section written by the agent (overview, steps, notes)
followed by the `git diff` of the PR, so the agent never writes diff content
itself. See [`@step-review/review-format`](packages/review-format/README.md) for
the format, and `step-review.dev/schema/v3.json` for its JSON Schema.

## Development

pnpm monorepo:

- [`packages/app`](packages/app): the web app (Vite, React, Primer).
- [`packages/review-format`](packages/review-format): the review file format:
  schemas, parser and consistency checks.
- [`packages/session-server`](packages/session-server): the server of sessions
  (a Cloudflare Worker with Durable Objects), and its protocol.
- [`packages/tooling/oxlint-custom-rules`](packages/tooling/oxlint-custom-rules):
  architecture lint rules.

See [Setup](docs/setup.md) for requirements, commands and deployment.
Contributors and coding agents follow the principles in
[`AGENTS.md`](AGENTS.md).

## License

[MIT](LICENSE)
