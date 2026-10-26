import { expect, it } from "vitest";
import loadReview from "./loadReview.ts";

it("gives two reviews of the same PR different IDs", () => {
  // Setup SUT
  const reviewText = (createdAt: string) =>
    [
      "#step-review:review",
      JSON.stringify({
        version: 3,
        createdAt,
        target: {
          title: "Fix sum",
          url: "https://github.com/acme/calc/pull/12",
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
    ].join("\n");

  // Exercise
  const firstResult = loadReview(
    "pr-12-20261011-093000.step-review",
    reviewText("2026-10-11T09:30:00Z"),
  );
  const secondResult = loadReview(
    "pr-12-20261012-141500.step-review",
    reviewText("2026-10-12T14:15:00Z"),
  );

  // Verify
  expect(firstResult.success && secondResult.success).toBe(true);
  expect(firstResult.success && firstResult.loadedReview.reviewId).not.toBe(
    secondResult.success && secondResult.loadedReview.reviewId,
  );
});
