---
name: step-review
description:
  Review a pull request, branch or commit range step by step, and write the
  review as a file that the user opens in the Step Review app.
---

# Step Review

The user reviews code changes in the Step Review app (https://step-review.dev).
Your job is to prepare the review: split the changes into steps the user goes
through one at a time, and write notes on the changes. You write a single review
file; the user drops it into the app.

Don't post anything on the PR, and don't commit the review file.

## Workflow

1. Identify the changes and their commits (see "Base and head").
2. Read the whole diff and enough of the surrounding code to understand it.
3. Split the changes into steps (see "Steps").
4. Write notes (see "Notes").
5. Write the review's JSON to a temporary file outside the repository, then
   build the review file with the CLI (see "Writing the file"). Fix every
   problem it reports and build again, until it reports none.
6. Tell the user the file's path.

Every review is a new file. Never overwrite or edit an earlier review file, even
for the same PR: the user may still be going through it. Building the file you
are writing again is fine.

## Base and head

- **PR**: get the metadata with
  `gh pr view <number> --json title,url,baseRefName,headRefName,headRefOid` (or
  the equivalent for other hosts). Fetch the head if needed
  (`git fetch origin pull/<number>/head`). The base commit is the merge base:
  `git merge-base origin/<baseRefName> <headRefOid>`.
- **Branch or range** (`main..feature`, or just `feature`, meaning against the
  default branch): the head is the tip of the branch, the base is the merge base
  with the other side.

Use full commit hashes in the JSON. Read files at the head commit
(`git show <head>:<path>`), not from the working tree, which can differ.

## Steps

A step is a group of changes the reviewer reads together. Choose the grouping
that makes this particular change easiest to understand; there is no fixed rule.
Useful criteria:

- One step per part of the system (e.g. contract, server, client), ordered so
  that each step builds on the previous ones (usually bottom-up: types and data
  first, then logic, then UI, then tests).
- One step per concern when a change does several things.
- Mechanical changes (renames, moved code, updated test literals, generated
  files) in their own steps, at the end, so they can be skimmed.

Give each step an `attention` level: `high` for the parts that need careful
thought, `low` for mechanical changes to skim, `normal` otherwise.

Every changed file must be in at least one step. A file whose changes belong to
different steps can appear in several steps, each listing the line `ranges`
whose hunks it shows. For generated files (lockfiles, snapshots), add a
`summary` describing the change; the app shows it instead of the diff.

Write an `intro` for each step: what the step's changes do, and what to look at.
Keep it short; details go in notes.

## Notes

Notes are anchored to a line of the diff (or to a file, or a step). There are
two kinds:

- `explainer`: why a change was made, or what it does when that isn't obvious.
  Write them for the changes a reviewer would otherwise have to puzzle over;
  don't paraphrase code that speaks for itself.
- `issue`: something the reviewer should check or act on: a bug, a risk, a
  missing test, a questionable design. Give each a `severity`: `blocker`,
  `concern`, `question` or `nit`. Be concrete: say what is wrong and why, and
  suggest a fix.

Anchors:

- `side: "new"` for added and unchanged lines, with the line number in the head
  version of the file.
- `side: "old"` for deleted lines, with the line number in the base version.
- `text`: the exact content of that line (without the `+`/`-` prefix). The app
  uses it to detect a wrong line number.
- `endLine` when the note covers several lines.
- The line must be in the diff: a changed line, or a context line near one (the
  diff has 20 lines of context around each change).

Get line numbers from the files themselves (e.g.
`git show <head>:<path> | nl -ba`), not by counting lines in the diff.

Note IDs (`n1`, `n2`, …) must be unique in the review. All text fields are
Markdown. To link to another part of the review, use `[text](note:n12)`,
`[text](step:<step id>)` or `[text](file:<path>)`.

## Writing the file

Name the file after the PR or the branch, followed by the UTC time it is first
built (`date -u +%Y%m%d-%H%M%S`), so that every review gets its own name
(`pr-123-20261025-143012.step-review`), at the root of the repository, unless
the user asked for another name. Write the JSON of the review to a temporary
file outside the repository, then build the review file with the Step Review
CLI, from the repository. If the `step-review` command is installed, run it:

```sh
step-review build /tmp/step-review.json \
  --output pr-123-20261025-143012.step-review
```

Otherwise, run `@step-review/cli@latest` with the package runner the user
prefers, otherwise the one the repository uses (`pnpm dlx`, `yarn dlx`, `bunx`),
otherwise `npx`:

```sh
npx @step-review/cli@latest build /tmp/step-review.json \
  --output pr-123-20261025-143012.step-review
```

The CLI appends the diff between the JSON's base and head commits, and reports
the problems the app would show: invalid JSON, fields that don't match the
schema, notes and ranges that don't match the diff, changed files in no step.
Fix them in the JSON and build again with the same file name, until it reports
none. `check <file>` reports the problems of an existing review file. If an
installed `step-review` rejects the JSON's `version`, it is out of date: ask the
user to update it.

If running the CLI is blocked or denied (e.g. by a permission check on
downloaded packages), don't work around it: stop and ask the user to allow it,
or to install it with `npm install --global @step-review/cli`.

Only if the CLI can't run for lack of network access, build the file by hand,
and tell the user that it wasn't checked:

```sh
{
  echo '#step-review:review' &&
  jq . /tmp/step-review.json &&
  echo '#step-review:diff' &&
  git -c core.quotePath=false diff --no-color --no-ext-diff -M -U20 \
    --src-prefix=a/ --dst-prefix=b/ <base> <head>
} > pr-123-20261025-143012.step-review
```

Use exactly these commands. The app parses the output, and notes rely on the 20
lines of context of the `git diff`. `jq .` fails on invalid JSON, and ends the
JSON with a newline, which the line after it needs: don't replace it with `cat`.
Without `jq`, use `python3 -m json.tool /tmp/step-review.json`.

## JSON format

The JSON Schema is at https://step-review.dev/schema/v3.json. Example:

```json
{
  "$schema": "https://step-review.dev/schema/v3.json",
  "version": 3,
  "createdAt": "2026-10-11T09:30:00Z",
  "target": {
    "title": "Validate IDs in the API",
    "url": "https://github.com/acme/app/pull/123",
    "baseRef": "main",
    "headRef": "validate-ids",
    "baseCommit": "<full hash>",
    "headCommit": "<full hash>"
  },
  "overview": {
    "summary": "What the changes do, in a paragraph or two.",
    "readingPlan": "Steps 1–3 cover the logic; step 4 is a mechanical rename."
  },
  "steps": [
    {
      "id": "validation",
      "title": "ID validation",
      "attention": "high",
      "intro": "Adds `parseId` and uses it in every handler.",
      "notes": [
        { "id": "n1", "kind": "explainer", "body": "Step-level note." }
      ],
      "files": [
        {
          "path": "src/api/parseId.ts",
          "notes": [
            {
              "id": "n2",
              "kind": "issue",
              "severity": "concern",
              "anchor": {
                "side": "new",
                "line": 12,
                "text": "  return id.trim();"
              },
              "body": "Trimming hides malformed input. Reject it instead?"
            }
          ]
        },
        {
          "path": "src/api/handlers.ts",
          "ranges": [{ "side": "new", "start": 40, "end": 75 }]
        }
      ]
    }
  ]
}
```

- `path` is the file's new path, or its old path if it was deleted.
- Step IDs use letters, digits, `-` and `_`, and are unique in the review.
- Omit optional fields rather than setting them to `null`.

## Notes from the app

Notes the user copies from the app include the note ID and the review file name,
so you can find the note in the file.
