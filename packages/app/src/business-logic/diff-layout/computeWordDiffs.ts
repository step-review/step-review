import type { DiffLine, Hunk } from "@step-review/review-format";
import { diffWordsWithSpace } from "diff";
import type TextRange from "./TextRange.ts";

/** Above this share of changed characters, word highlights are just noise. */
const maximumChangedShare = 0.6;

/**
 * Finds the changed words of each deleted line paired with an added line (the
 * n-th deletion of a run with the n-th addition that follows it).
 */
export default function computeWordDiffs(
  hunks: Hunk[],
): Map<DiffLine, TextRange[]> {
  const wordDiffs = new Map<DiffLine, TextRange[]>();
  for (const hunk of hunks) {
    let index = 0;
    while (index < hunk.lines.length) {
      const deletions: DiffLine[] = [];
      const additions: DiffLine[] = [];
      while (hunk.lines[index]?.type === "deletion") {
        deletions.push(hunk.lines[index]!);
        index++;
      }
      while (hunk.lines[index]?.type === "addition") {
        additions.push(hunk.lines[index]!);
        index++;
      }
      if (deletions.length === 0 && additions.length === 0) {
        index++;
      }
      for (
        let pair = 0;
        pair < Math.min(deletions.length, additions.length);
        pair++
      ) {
        addWordDiff(wordDiffs, deletions[pair]!, additions[pair]!);
      }
    }
  }
  return wordDiffs;
}

function addWordDiff(
  wordDiffs: Map<DiffLine, TextRange[]>,
  deletion: DiffLine,
  addition: DiffLine,
): void {
  const oldRanges: TextRange[] = [];
  const newRanges: TextRange[] = [];
  let oldOffset = 0;
  let newOffset = 0;
  let changedLength = 0;
  for (const change of diffWordsWithSpace(deletion.content, addition.content)) {
    const length = change.value.length;
    if (change.removed) {
      oldRanges.push({ start: oldOffset, end: oldOffset + length });
      oldOffset += length;
      changedLength += length;
    } else if (change.added) {
      newRanges.push({ start: newOffset, end: newOffset + length });
      newOffset += length;
      changedLength += length;
    } else {
      oldOffset += length;
      newOffset += length;
    }
  }
  const totalLength = deletion.content.length + addition.content.length;
  if (totalLength === 0 || changedLength / totalLength > maximumChangedShare) {
    return;
  }
  wordDiffs.set(deletion, oldRanges);
  wordDiffs.set(addition, newRanges);
}
