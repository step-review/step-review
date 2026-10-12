import type FileDiff from "../diff/FileDiff.ts";
import type Hunk from "../diff/Hunk.ts";
import type LineRange from "../round/types/LineRange.ts";

/**
 * Returns the hunks of a file that a step shows: all of them without ranges,
 * otherwise those overlapping at least one range.
 */
export default function selectHunks(
  fileDiff: FileDiff,
  ranges: LineRange[] | undefined,
): Hunk[] {
  if (!ranges) {
    return fileDiff.hunks;
  }
  return fileDiff.hunks.filter((hunk) =>
    ranges.some((range) => {
      const start = range.side === "new" ? hunk.newStart : hunk.oldStart;
      const lineCount =
        range.side === "new" ? hunk.newLineCount : hunk.oldLineCount;
      // A hunk with no lines on a side sits right after its start line.
      const end = start + Math.max(lineCount, 1) - 1;
      return range.start <= end && range.end >= start;
    }),
  );
}
