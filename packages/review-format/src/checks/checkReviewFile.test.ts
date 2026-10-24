import { expect, it } from "vitest";
import parseReviewFile from "../file/parseReviewFile.ts";
import checkReviewFile from "./checkReviewFile.ts";

function parse(text: string) {
  const result = parseReviewFile(text);
  if (!result.success) {
    throw new Error(JSON.stringify(result.problems));
  }
  return result.reviewFile;
}

it("finds no problems in a consistent review", () => {
  // Setup SUT
  const reviewFile = parse(
    [
      "#step-review:review",
      JSON.stringify({
        version: 3,
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
            files: [
              {
                path: "sum.ts",
                notes: [
                  {
                    id: "n1",
                    kind: "issue",
                    severity: "nit",
                    anchor: { side: "new", line: 1, text: "a + b" },
                    body: "Check.",
                  },
                ],
              },
            ],
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
    ].join("\n"),
  );

  // Exercise
  const warnings = checkReviewFile(reviewFile);

  // Verify
  expect(warnings).toEqual([]);
});

it("warns about a note anchored to a line outside the diff", () => {
  // Setup SUT
  const reviewFile = parse(
    [
      "#step-review:review",
      JSON.stringify({
        version: 3,
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
            files: [
              {
                path: "sum.ts",
                notes: [
                  {
                    id: "n1",
                    kind: "explainer",
                    anchor: { side: "new", line: 40 },
                    body: "Why.",
                  },
                ],
              },
            ],
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
    ].join("\n"),
  );

  // Exercise
  const warnings = checkReviewFile(reviewFile);

  // Verify
  expect(warnings).toEqual([
    "Note `n1` (new line 40 of `sum.ts`) points at a line that is not in the step's diff.",
  ]);
});

it("warns about a note whose line text does not match the diff", () => {
  // Setup SUT
  const reviewFile = parse(
    [
      "#step-review:review",
      JSON.stringify({
        version: 3,
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
            files: [
              {
                path: "sum.ts",
                notes: [
                  {
                    id: "n1",
                    kind: "explainer",
                    anchor: { side: "old", line: 1, text: "a * b" },
                    body: "Why.",
                  },
                ],
              },
            ],
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
    ].join("\n"),
  );

  // Exercise
  const warnings = checkReviewFile(reviewFile);

  // Verify
  expect(warnings).toEqual([
    "Note `n1` (old line 1 of `sum.ts`) expects `a * b`, but the line is `a - b`.",
  ]);
});

it("warns about files that are in no step", () => {
  // Setup SUT
  const reviewFile = parse(
    [
      "#step-review:review",
      JSON.stringify({
        version: 3,
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
      "diff --git a/other.ts b/other.ts",
      "--- a/other.ts",
      "+++ b/other.ts",
      "@@ -1 +1 @@",
      "-x",
      "+y",
    ].join("\n"),
  );

  // Exercise
  const warnings = checkReviewFile(reviewFile);

  // Verify
  expect(warnings).toEqual(["Files in no step: `other.ts`."]);
});
