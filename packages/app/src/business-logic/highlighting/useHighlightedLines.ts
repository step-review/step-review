import type { DiffLine, Hunk } from "@step-review/review-format";
import { useEffect, useState } from "react";
import type HighlightToken from "./HighlightToken.ts";

/** Highlighted tokens per line, empty until highlighting finishes. */
export default function useHighlightedLines(
  hunks: Hunk[],
  path: string,
  enabled: boolean,
): Map<DiffLine, HighlightToken[]> {
  const [highlightedLines, setHighlightedLines] = useState(
    () => new Map<DiffLine, HighlightToken[]>(),
  );
  useEffect(() => {
    if (!enabled) {
      return;
    }
    let cancelled = false;
    // Shiki is large: load it only when there is code to highlight.
    import("./highlightHunks.ts")
      .then(({ default: highlightHunks }) => highlightHunks(hunks, path))
      .then(
        (result) => {
          if (!cancelled) {
            setHighlightedLines(result);
          }
        },
        (error: unknown) => {
          // Highlighting is cosmetic: show plain text when it fails.
          console.warn(`Could not highlight ${path}`, error);
        },
      );
    return () => {
      cancelled = true;
    };
  }, [hunks, path, enabled]);
  return highlightedLines;
}
