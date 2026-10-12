import { parseUnifiedDiff } from "@step-review/review-format";
import { expect, it } from "vitest";
import computeWordDiffs from "./computeWordDiffs.ts";

it("highlights the changed word of a modified line", () => {
  // Setup SUT
  const hunks = parseUnifiedDiff(
    [
      "diff --git a/a.ts b/a.ts",
      "--- a/a.ts",
      "+++ b/a.ts",
      "@@ -1 +1 @@",
      "-const total = first - second;",
      "+const total = first + second;",
    ].join("\n"),
  )[0]!.hunks;

  // Exercise
  const wordDiffs = computeWordDiffs(hunks);

  // Verify
  expect(hunks[0]!.lines.map((line) => wordDiffs.get(line))).toEqual([
    [{ start: 20, end: 21 }],
    [{ start: 20, end: 21 }],
  ]);
});

it("does not highlight words of lines that changed completely", () => {
  // Setup SUT
  const hunks = parseUnifiedDiff(
    [
      "diff --git a/a.ts b/a.ts",
      "--- a/a.ts",
      "+++ b/a.ts",
      "@@ -1 +1 @@",
      "-import x from 'y';",
      "+export default 42;",
    ].join("\n"),
  )[0]!.hunks;

  // Exercise
  const wordDiffs = computeWordDiffs(hunks);

  // Verify
  expect(wordDiffs.size).toBe(0);
});
