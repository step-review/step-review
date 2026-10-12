import type HighlightToken from "../highlighting/HighlightToken.ts";
import type LineSegment from "./LineSegment.ts";
import type TextRange from "./TextRange.ts";

/**
 * Splits a line into segments with uniform highlighting: syntax colors from the
 * tokens, and changed words from the word ranges.
 */
export default function splitLineSegments(
  content: string,
  tokens: HighlightToken[] | undefined,
  changedRanges: TextRange[] | undefined,
): LineSegment[] {
  const sourceTokens = tokens ?? [{ content, color: null, darkColor: null }];
  const boundaries = new Set<number>([0, content.length]);
  let offset = 0;
  for (const token of sourceTokens) {
    boundaries.add(offset);
    offset += token.content.length;
  }
  for (const range of changedRanges ?? []) {
    boundaries.add(range.start);
    boundaries.add(range.end);
  }
  const sortedBoundaries = [...boundaries]
    .filter((boundary) => boundary <= content.length)
    .sort((first, second) => first - second);
  const segments: LineSegment[] = [];
  let tokenIndex = 0;
  let tokenStart = 0;
  for (let index = 0; index < sortedBoundaries.length - 1; index++) {
    const start = sortedBoundaries[index]!;
    const end = sortedBoundaries[index + 1]!;
    while (
      tokenIndex < sourceTokens.length - 1 &&
      tokenStart + sourceTokens[tokenIndex]!.content.length <= start
    ) {
      tokenStart += sourceTokens[tokenIndex]!.content.length;
      tokenIndex++;
    }
    const token = sourceTokens[tokenIndex];
    segments.push({
      text: content.slice(start, end),
      color: token?.color ?? null,
      darkColor: token?.darkColor ?? null,
      changed: (changedRanges ?? []).some(
        (range) => range.start <= start && range.end >= end,
      ),
    });
  }
  return segments;
}
