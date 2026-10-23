import { expect, it } from "vitest";
import parseReviewFile from "./parseReviewFile.ts";

it("parses the review data and the diff", () => {
  // Exercise
  const result = parseReviewFile(
    [
      "#step-review:review",
      JSON.stringify({
        version: 2,
        createdAt: "2026-10-11T09:30:00Z",
        target: {
          title: "Fix sum",
          baseCommit: "aaaaaaa",
          headCommit: "bbbbbbb",
        },
        overview: { summary: "Fixes `sum`." },
        steps: [
          {
            id: "fix",
            title: "Fix",
            attention: "high",
            intro: "The fix.",
            files: [{ path: "sum.ts" }],
          },
        ],
      }),
      "#step-review:diff",
      "diff --git a/sum.ts b/sum.ts",
      "--- a/sum.ts",
      "+++ b/sum.ts",
      "@@ -1 +1 @@",
      "-a - b",
      "+a + b",
      "",
    ].join("\n"),
  );

  // Verify
  expect(
    result.success && {
      title: result.reviewFile.data.target.title,
      paths: result.reviewFile.diff.map((fileDiff) => fileDiff.path),
    },
  ).toEqual({ title: "Fix sum", paths: ["sum.ts"] });
});

it("reports a section after the diff", () => {
  // Exercise
  const result = parseReviewFile(
    [
      "#step-review:review",
      "{}",
      "#step-review:diff",
      "",
      "#step-review:review",
      "{}",
    ].join("\n"),
  );

  // Verify
  expect(!result.success && result.problems).toEqual([
    {
      message: "Unexpected `#step-review:review` section after the diff.",
      location: "line 5",
    },
  ]);
});

it("reports schema problems with their location", () => {
  // Exercise
  const result = parseReviewFile(
    [
      "#step-review:review",
      JSON.stringify({
        version: 2,
        createdAt: "2026-10-11T09:30:00Z",
        target: {
          title: "Fix sum",
          baseCommit: "aaaaaaa",
          headCommit: "bbbbbbb",
        },
        overview: { summary: "Fixes `sum`." },
        steps: [
          {
            id: "fix",
            title: "Fix",
            attention: "urgent",
            intro: "The fix.",
            files: [{ path: "sum.ts" }],
          },
        ],
      }),
      "#step-review:diff",
      "",
    ].join("\n"),
  );

  // Verify
  expect(
    !result.success && result.problems.map((problem) => problem.location),
  ).toEqual(["steps[0].attention"]);
});

it("reports invalid JSON", () => {
  // Exercise
  const result = parseReviewFile(
    ["#step-review:review", "{ not json", "#step-review:diff", ""].join("\n"),
  );

  // Verify
  expect(
    !result.success && result.problems.map((problem) => problem.location),
  ).toEqual(["line 2"]);
});

it("reports a review without a diff section", () => {
  // Exercise
  const result = parseReviewFile(["#step-review:review", "{}"].join("\n"));

  // Verify
  expect(
    !result.success && result.problems.map((problem) => problem.message),
  ).toEqual(["The file has no `#step-review:diff` section."]);
});

it("reports content before the first section", () => {
  // Exercise
  const result = parseReviewFile(["{}", "#step-review:review"].join("\n"));

  // Verify
  expect(!result.success && result.problems).toEqual([
    {
      message: "The file must start with a `#step-review:review` line.",
      location: "line 1",
    },
  ]);
});

it("reports a diff problem with its line in the review file", () => {
  // Exercise
  const result = parseReviewFile(
    [
      "#step-review:review",
      JSON.stringify({
        version: 2,
        createdAt: "2026-10-11T09:30:00Z",
        target: {
          title: "Fix sum",
          baseCommit: "aaaaaaa",
          headCommit: "bbbbbbb",
        },
        overview: { summary: "Fixes `sum`." },
        steps: [
          {
            id: "fix",
            title: "Fix",
            attention: "high",
            intro: "The fix.",
            files: [{ path: "sum.ts" }],
          },
        ],
      }),
      "#step-review:diff",
      "diff --git a/sum.ts b/sum.ts",
      "--- a/sum.ts",
      "+++ b/sum.ts",
      "@@ -1,2 +1,2 @@",
      " one line only",
    ].join("\n"),
  );

  // Verify
  expect(
    !result.success && result.problems.map((problem) => problem.location),
  ).toEqual(["line 8"]);
});
