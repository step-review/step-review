import type { DiffLine, Hunk } from "@step-review/review-format";
import type { BundledLanguage } from "shiki";
import detectLanguage from "./detectLanguage.ts";
import getHighlighter from "./getHighlighter.ts";
import type HighlightToken from "./HighlightToken.ts";

/** Longer lines are usually minified code: highlighting them is slow. */
const maximumLineLength = 1000;

/**
 * Highlights the lines of some hunks of a file, if its language is known. Each
 * side of a hunk is highlighted as one piece of code, so multi-line constructs
 * inside a hunk get the right colors.
 */
export default async function highlightHunks(
  hunks: Hunk[],
  path: string,
): Promise<Map<DiffLine, HighlightToken[]>> {
  const highlightedLines = new Map<DiffLine, HighlightToken[]>();
  const language = detectLanguage(path) as BundledLanguage | null;
  if (!language) {
    return highlightedLines;
  }
  const highlighter = await getHighlighter();
  await highlighter.loadLanguage(language);
  for (const hunk of hunks) {
    for (const side of ["old", "new"] as const) {
      const lines = hunk.lines.filter(
        (line) =>
          line.type === "context" ||
          line.type === (side === "old" ? "deletion" : "addition"),
      );
      if (lines.some((line) => line.content.length > maximumLineLength)) {
        continue;
      }
      const { tokens } = highlighter.codeToTokens(
        lines.map((line) => line.content).join("\n"),
        {
          lang: language,
          themes: { light: "github-light", dark: "github-dark" },
        },
      );
      for (const [index, line] of lines.entries()) {
        // Context lines take their colors from the new side.
        if (side === "old" && line.type === "context") {
          continue;
        }
        highlightedLines.set(
          line,
          (tokens[index] ?? []).map((token) => ({
            content: token.content,
            color: token.htmlStyle?.["color"] ?? null,
            darkColor: token.htmlStyle?.["--shiki-dark"] ?? null,
          })),
        );
      }
    }
  }
  return highlightedLines;
}
