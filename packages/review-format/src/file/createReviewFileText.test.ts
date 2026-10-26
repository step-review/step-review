import { expect, it } from "vitest";
import createReviewFileText from "./createReviewFileText.ts";
import parseReviewFile from "./parseReviewFile.ts";

it("writes a file that parses back to the same data and diff", () => {
  // Exercise
  const text = createReviewFileText(
    {
      version: 3,
      createdAt: "2026-10-11T09:30:00Z",
      target: {
        title: "Fix sum",
        baseCommit: "aaaaaaa",
        headCommit: "bbbbbbb",
      },
      overview: {
        summary: "Fixes `sum`.\n\n#step-review:diff is not a marker.",
      },
      steps: [
        {
          id: "fix",
          title: "Fix",
          attention: "high",
          intro: "The fix.",
          files: [{ path: "sum.ts" }],
        },
      ],
    },
    [
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
  const result = parseReviewFile(text);
  expect(
    result.success && {
      summary: result.reviewFile.data.overview.summary,
      paths: result.reviewFile.diff.map((fileDiff) => fileDiff.path),
    },
  ).toEqual({
    summary: "Fixes `sum`.\n\n#step-review:diff is not a marker.",
    paths: ["sum.ts"],
  });
});
