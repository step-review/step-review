import type { DiffLine, Hunk } from "@step-review/review-format";
import type DiffRow from "./DiffRow.ts";
import lineKeys from "./lineKeys.ts";

interface Options {
  /** Context lines shown around each change. */
  contextLineCount: number;
  /** Keys (see `lineKeys`) of lines that must stay visible, e.g. noted ones. */
  pinnedLineKeys: Set<string>;
  /** IDs of gaps the reviewer expanded. */
  expandedGapIds: Set<string>;
}

/**
 * Lays out hunks as rows, hiding context lines far from changes (and from
 * pinned lines) behind expandable gaps.
 */
export default function buildDiffRows(
  hunks: Hunk[],
  { contextLineCount, pinnedLineKeys, expandedGapIds }: Options,
): DiffRow[] {
  const rows: DiffRow[] = [];
  for (const [hunkIndex, hunk] of hunks.entries()) {
    rows.push({ kind: "hunk", id: `hunk-${hunkIndex}`, hunk });
    const isInteresting = hunk.lines.map(
      (line) =>
        line.type !== "context" ||
        lineKeys(line).some((key) => pinnedLineKeys.has(key)),
    );
    const isVisible = hunk.lines.map((_line, index) => {
      const start = Math.max(0, index - contextLineCount);
      const end = Math.min(hunk.lines.length - 1, index + contextLineCount);
      return isInteresting.slice(start, end + 1).includes(true);
    });
    let hiddenLines: DiffLine[] = [];
    let hiddenStartIndex = 0;
    const flushHiddenLines = () => {
      const gapId = `gap-${hunkIndex}-${hiddenStartIndex}`;
      // Hiding a single line saves no space.
      if (hiddenLines.length === 1 || expandedGapIds.has(gapId)) {
        for (const [offset, line] of hiddenLines.entries()) {
          rows.push({
            kind: "line",
            id: `line-${hunkIndex}-${hiddenStartIndex + offset}`,
            line,
          });
        }
      } else if (hiddenLines.length > 1) {
        rows.push({ kind: "gap", id: gapId, hiddenLines });
      }
      hiddenLines = [];
    };
    for (const [index, line] of hunk.lines.entries()) {
      if (isVisible[index]) {
        flushHiddenLines();
        rows.push({ kind: "line", id: `line-${hunkIndex}-${index}`, line });
      } else {
        if (hiddenLines.length === 0) {
          hiddenStartIndex = index;
        }
        hiddenLines.push(line);
      }
    }
    flushHiddenLines();
  }
  return rows;
}
