import { parseUnifiedDiff } from "@step-review/review-format";
import { expect, it } from "vitest";
import buildDiffRows from "./buildDiffRows.ts";

function parseHunks(diffLines: string[]) {
  return parseUnifiedDiff(
    [
      "diff --git a/a.txt b/a.txt",
      "--- a/a.txt",
      "+++ b/a.txt",
      ...diffLines,
    ].join("\n"),
  )[0]!.hunks;
}

it("hides context lines far from changes behind a gap", () => {
  // Setup SUT
  const hunks = parseHunks([
    "@@ -1,6 +1,6 @@",
    " 1",
    " 2",
    " 3",
    " 4",
    "-5",
    "+five",
    " 6",
  ]);

  // Exercise
  const rows = buildDiffRows(hunks, {
    contextLineCount: 1,
    pinnedLineKeys: new Set(),
    expandedGapIds: new Set(),
  });

  // Verify
  expect(
    rows.map((row) =>
      row.kind === "line"
        ? row.line.content
        : row.kind === "gap"
          ? `gap of ${row.hiddenLines.length}`
          : "hunk",
    ),
  ).toEqual(["hunk", "gap of 3", "4", "5", "five", "6"]);
});

it("shows the lines of an expanded gap", () => {
  // Setup SUT
  const hunks = parseHunks([
    "@@ -1,4 +1,4 @@",
    " 1",
    " 2",
    " 3",
    "-4",
    "+four",
  ]);

  // Exercise
  const rows = buildDiffRows(hunks, {
    contextLineCount: 0,
    pinnedLineKeys: new Set(),
    expandedGapIds: new Set(["gap-0-0"]),
  });

  // Verify
  expect(rows.filter((row) => row.kind === "line").length).toBe(5);
});

it("keeps pinned context lines and their surroundings visible", () => {
  // Setup SUT
  const hunks = parseHunks([
    "@@ -1,7 +1,7 @@",
    " 1",
    " 2",
    " 3",
    " 4",
    " 5",
    "-6",
    "+six",
    " 7",
  ]);

  // Exercise
  const rows = buildDiffRows(hunks, {
    contextLineCount: 0,
    pinnedLineKeys: new Set(["new:2"]),
    expandedGapIds: new Set(),
  });

  // Verify
  expect(
    rows.map((row) =>
      row.kind === "line"
        ? row.line.content
        : row.kind === "gap"
          ? `gap of ${row.hiddenLines.length}`
          : "hunk",
    ),
  ).toEqual(["hunk", "1", "2", "gap of 3", "6", "six", "7"]);
});
