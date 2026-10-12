import { parseReviewFile } from "@step-review/review-format";
import { expect, it } from "vitest";
import indexNotes from "../rounds/indexNotes.ts";
import exportFeedbackMarkdown from "./exportFeedbackMarkdown.ts";

function loadReviewFile(text: string) {
  const result = parseReviewFile(text);
  if (!result.success) {
    throw new Error(JSON.stringify(result.problems));
  }
  return result.reviewFile;
}

it("lists accepted issues with their reply and the reviewer's comments", () => {
  // Setup SUT
  const reviewFile = loadReviewFile(
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
            files: [
              {
                path: "sum.ts",
                notes: [
                  {
                    id: "n1",
                    kind: "issue",
                    severity: "concern",
                    anchor: { side: "new", line: 1 },
                    body: "Overflows.",
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
  const loadedReview = {
    fileName: "pr-1.step-review",
    reviewFile,
    warnings: [],
    storageKey: "key",
  };

  // Exercise
  const markdown = exportFeedbackMarkdown(
    loadedReview,
    {
      viewedFingerprints: [],
      issueVerdicts: { n1: { verdict: "accepted", reply: "Use BigInt." } },
      comments: [
        {
          id: "c1",
          roundNumber: 1,
          target: {
            kind: "line",
            stepId: "fix",
            path: "sum.ts",
            side: "new",
            line: 1,
            lineText: "a + b",
          },
          body: "Add a test.",
          createdAt: "2026-10-11T10:00:00Z",
        },
      ],
    },
    indexNotes(reviewFile),
  );

  // Verify
  expect(markdown).toBe(
    [
      '# Feedback on "Fix sum"',
      "",
      "From the step-review in `pr-1.step-review`.",
      "",
      "## Issues raised by the review",
      "",
      "- Accepted issue `n1` on `sum.ts:1`:",
      "  > Overflows.",
      "  Reply: Use BigInt.",
      "",
      "## Comments",
      "",
      "- On `sum.ts:1` (round 1): Add a test.",
      "  > a + b",
      "",
    ].join("\n"),
  );
});
