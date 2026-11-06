---
name: release
description:
  Merge a pull request and release a new version of Step Review. Use when the
  user asks to merge and release, cut a release, or ship a new version.
---

# Release

Follow [Releasing](../../../docs/setup.md#releasing) in `docs/setup.md`. Asking
for a release authorizes pushing the changelog entry and the release commit
directly to `main`. Stop and report to the user when a step fails.

## Merge the pull request

When the user names a pull request, or the session has one:

1. Check that all its checks pass (`gh pr checks <number>`). Do not merge
   otherwise.
2. Merge it with a merge commit and delete its branch:
   `gh pr merge <number> --merge --delete-branch`.
3. Switch to `main`, pull, run `git fetch --prune`, and delete the merged local
   branch if it is left.

## Choose the version

Read the commits since the last `vX.Y.Z` tag. Bump the patch version for fixes
and polish, and the minor version for new user-visible features. Ask the user
before a major version.

## Write the changelog entry

Add a `## X.Y.Z` section at the top of `CHANGELOG.md`, one bullet per
user-visible change, in the style of the existing entries: say what the app or
CLI now does, in the present tense. Leave out changes users don't see, such as
dependency, tooling and CI updates. If nothing is user-visible, ask the user
whether to release anyway.

Run `pnpm exec oxfmt --write CHANGELOG.md`, then commit it on `main` as
`Add the X.Y.Z changelog entry`.

## Release

1. Run `pnpm release:prepare X.Y.Z`. It runs QA, so let it take a few minutes.
2. Run `git push --atomic origin main vX.Y.Z`.
3. Wait for the `Tags` workflow run of the tag to finish
   (`gh run watch <run-id> --exit-status`) and check that both its jobs passed.
4. Tell the user the version, the changelog entry, and the workflow result. npm
   can take a few minutes to list the new version as `latest`.
