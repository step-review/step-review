import { expect, it } from "vitest";
import parsePullRequestNumber from "./parsePullRequestNumber.ts";

it.each([
  "https://github.com/acme/app/pull/166",
  "https://github.com/acme/app/pull/166/files",
  "https://gitlab.com/acme/app/-/merge_requests/166",
  "https://bitbucket.org/acme/app/pull-requests/166?tab=diff",
])("reads the PR number from %s", (url) => {
  // Exercise
  const pullRequestNumber = parsePullRequestNumber(url);

  // Verify
  expect(pullRequestNumber).toBe(166);
});

it.each([
  "https://github.com/acme/app/compare/main...feature",
  "https://github.com/acme/app/pull/166abc",
])("returns null for %s, which has no PR number", (url) => {
  // Exercise
  const pullRequestNumber = parsePullRequestNumber(url);

  // Verify
  expect(pullRequestNumber).toBeNull();
});
