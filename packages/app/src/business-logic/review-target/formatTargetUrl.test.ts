import { expect, it } from "vitest";
import formatTargetUrl from "./formatTargetUrl.ts";

it.each([
  "https://github.com/acme/app/pull/166",
  "https://github.com/acme/app/pull/166/files",
  "https://github.com/acme/app/pull/166?diff=split#discussion",
])("formats %s as the repository and PR number", (url) => {
  // Exercise
  const text = formatTargetUrl(url);

  // Verify
  expect(text).toBe("acme/app #166");
});

it.each([
  "https://github.com/acme/app/compare/main...feature",
  "https://github.com/acme/app/pull/166abc",
  "https://gitlab.com/acme/app/-/merge_requests/166",
  "https://example.com/acme/app/pull/166",
])("leaves %s, which is not a GitHub PR link, as it is", (url) => {
  // Exercise
  const text = formatTargetUrl(url);

  // Verify
  expect(text).toBe(url);
});
