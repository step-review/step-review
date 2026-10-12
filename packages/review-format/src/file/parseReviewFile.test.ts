import { expect, it } from "vitest";
import parseReviewFile from "./parseReviewFile.ts";

it("parses a file with one round", () => {
  // Exercise
  const result = parseReviewFile(
    [
      "#step-review:round",
      JSON.stringify({
        version: 1,
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
    result.success &&
      result.reviewFile.rounds.map((round) => ({
        number: round.number,
        title: round.data.target.title,
        paths: round.diff.map((fileDiff) => fileDiff.path),
        interdiff: round.interdiff,
      })),
  ).toEqual([
    { number: 1, title: "Fix sum", paths: ["sum.ts"], interdiff: null },
  ]);
});

it("parses a second round with an interdiff", () => {
  // Exercise
  const result = parseReviewFile(
    [
      "#step-review:round",
      JSON.stringify({
        version: 1,
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
      "#step-review:round",
      JSON.stringify({
        version: 1,
        createdAt: "2026-10-12T09:30:00Z",
        target: {
          title: "Fix sum",
          baseCommit: "aaaaaaa",
          headCommit: "ccccccc",
        },
        overview: { summary: "Fixes `sum`." },
        previousRound: { changes: ["Adds a test."], issues: [] },
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
      "#step-review:interdiff",
      "diff --git a/sum.test.ts b/sum.test.ts",
      "new file mode 100644",
      "--- /dev/null",
      "+++ b/sum.test.ts",
      "@@ -0,0 +1 @@",
      "+test",
    ].join("\n"),
  );

  // Verify
  expect(
    result.success &&
      result.reviewFile.rounds.map((round) => ({
        number: round.number,
        headCommit: round.data.target.headCommit,
        interdiffPaths:
          round.interdiff?.map((fileDiff) => fileDiff.path) ?? null,
      })),
  ).toEqual([
    { number: 1, headCommit: "bbbbbbb", interdiffPaths: null },
    { number: 2, headCommit: "ccccccc", interdiffPaths: ["sum.test.ts"] },
  ]);
});

it("reports schema problems with their location", () => {
  // Exercise
  const result = parseReviewFile(
    [
      "#step-review:round",
      JSON.stringify({
        version: 1,
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
  ).toEqual(["round 1, steps[0].attention"]);
});

it("reports invalid JSON", () => {
  // Exercise
  const result = parseReviewFile(
    ["#step-review:round", "{ not json", "#step-review:diff", ""].join("\n"),
  );

  // Verify
  expect(
    !result.success && result.problems.map((problem) => problem.location),
  ).toEqual(["round 1 (line 1)"]);
});

it("reports a round without a diff section", () => {
  // Exercise
  const result = parseReviewFile(["#step-review:round", "{}"].join("\n"));

  // Verify
  expect(
    !result.success && result.problems.map((problem) => problem.message),
  ).toEqual(["Round 1 has no `#step-review:diff` section."]);
});

it("reports content before the first section", () => {
  // Exercise
  const result = parseReviewFile(["{}", "#step-review:round"].join("\n"));

  // Verify
  expect(!result.success && result.problems).toEqual([
    {
      message: "The file must start with a `#step-review:round` line.",
      location: "line 1",
    },
  ]);
});

it("reports a diff problem with its line in the review file", () => {
  // Exercise
  const result = parseReviewFile(
    [
      "#step-review:round",
      JSON.stringify({
        version: 1,
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
