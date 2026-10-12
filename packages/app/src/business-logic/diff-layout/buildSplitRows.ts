import type { DiffLine } from "@step-review/review-format";
import type DiffRow from "./DiffRow.ts";
import type SplitDiffRow from "./SplitDiffRow.ts";

/**
 * Converts unified rows to side-by-side rows: context lines on both sides, and
 * each run of deletions paired with the additions that follow it.
 */
export default function buildSplitRows(rows: DiffRow[]): SplitDiffRow[] {
  const splitRows: SplitDiffRow[] = [];
  let deletions: { id: string; line: DiffLine }[] = [];
  let additions: { id: string; line: DiffLine }[] = [];
  const flushChanges = () => {
    for (
      let index = 0;
      index < Math.max(deletions.length, additions.length);
      index++
    ) {
      const deletion = deletions[index];
      const addition = additions[index];
      splitRows.push({
        kind: "lines",
        id: (deletion ?? addition)!.id,
        oldLine: deletion?.line ?? null,
        newLine: addition?.line ?? null,
      });
    }
    deletions = [];
    additions = [];
  };
  for (const row of rows) {
    if (row.kind === "line" && row.line.type === "deletion") {
      if (additions.length > 0) {
        flushChanges();
      }
      deletions.push(row);
    } else if (row.kind === "line" && row.line.type === "addition") {
      additions.push(row);
    } else {
      flushChanges();
      splitRows.push(
        row.kind === "line"
          ? { kind: "lines", id: row.id, oldLine: row.line, newLine: row.line }
          : row,
      );
    }
  }
  flushChanges();
  return splitRows;
}
