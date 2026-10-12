import { parseUnifiedDiff } from "@step-review/review-format";
import { expect, it } from "vitest";
import buildDiffRows from "./buildDiffRows.ts";
import buildSplitRows from "./buildSplitRows.ts";

it("pairs deletions with the additions that follow them", () => {
  // Setup SUT
  const hunks = parseUnifiedDiff(
    [
      "diff --git a/a.txt b/a.txt",
      "--- a/a.txt",
      "+++ b/a.txt",
      "@@ -1,3 +1,4 @@",
      " same",
      "-old 1",
      "-old 2",
      "+new 1",
      "+new 2",
      "+new 3",
    ].join("\n"),
  )[0]!.hunks;
  const rows = buildDiffRows(hunks, {
    contextLineCount: 3,
    pinnedLineKeys: new Set(),
    expandedGapIds: new Set(),
  });

  // Exercise
  const splitRows = buildSplitRows(rows);

  // Verify
  expect(
    splitRows.flatMap((row) =>
      row.kind === "lines"
        ? [[row.oldLine?.content ?? null, row.newLine?.content ?? null]]
        : [],
    ),
  ).toEqual([
    ["same", "same"],
    ["old 1", "new 1"],
    ["old 2", "new 2"],
    [null, "new 3"],
  ]);
});
