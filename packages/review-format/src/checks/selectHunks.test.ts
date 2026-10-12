import { expect, it } from "vitest";
import parseUnifiedDiff from "../diff/parseUnifiedDiff.ts";
import selectHunks from "./selectHunks.ts";

it("selects only the hunks that overlap a range", () => {
  // Setup SUT
  const [fileDiff] = parseUnifiedDiff(
    [
      "diff --git a/a.txt b/a.txt",
      "--- a/a.txt",
      "+++ b/a.txt",
      "@@ -1 +1 @@",
      "-1",
      "+one",
      "@@ -50 +50 @@",
      "-50",
      "+fifty",
    ].join("\n"),
  );

  // Exercise
  const hunks = selectHunks(fileDiff!, [{ side: "new", start: 45, end: 55 }]);

  // Verify
  expect(hunks.map((hunk) => hunk.newStart)).toEqual([50]);
});

it("selects every hunk without ranges", () => {
  // Setup SUT
  const [fileDiff] = parseUnifiedDiff(
    [
      "diff --git a/a.txt b/a.txt",
      "--- a/a.txt",
      "+++ b/a.txt",
      "@@ -1 +1 @@",
      "-1",
      "+one",
      "@@ -50 +50 @@",
      "-50",
      "+fifty",
    ].join("\n"),
  );

  // Exercise
  const hunks = selectHunks(fileDiff!, undefined);

  // Verify
  expect(hunks.map((hunk) => hunk.newStart)).toEqual([1, 50]);
});
