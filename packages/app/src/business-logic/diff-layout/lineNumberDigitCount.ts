import type { Hunk } from "@step-review/review-format";

/** Digits of the largest line number in the hunks: what the gutter must fit. */
export default function lineNumberDigitCount(hunks: Hunk[]): number {
  const largestLineNumber = Math.max(
    0,
    ...hunks.flatMap((hunk) =>
      hunk.lines.flatMap((line) => [
        line.oldLineNumber ?? 0,
        line.newLineNumber ?? 0,
      ]),
    ),
  );
  return String(largestLineNumber).length;
}
