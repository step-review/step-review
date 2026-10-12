import type DiffLine from "../diff/DiffLine.ts";
import type Hunk from "../diff/Hunk.ts";
import type DiffSide from "../round/types/DiffSide.ts";

/** Finds the line with the given number on one side of the diff. */
export default function findDiffLine(
  hunks: Hunk[],
  side: DiffSide,
  lineNumber: number,
): DiffLine | null {
  for (const hunk of hunks) {
    for (const line of hunk.lines) {
      const sideLineNumber =
        side === "new" ? line.newLineNumber : line.oldLineNumber;
      if (sideLineNumber === lineNumber) {
        return line;
      }
    }
  }
  return null;
}
