import type Hunk from "./Hunk.ts";

const hunkHeaderPattern = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@ ?(.*)$/u;

export default function parseHunkHeader(line: string): Hunk | null {
  const match = hunkHeaderPattern.exec(line);
  if (!match) {
    return null;
  }
  return {
    oldStart: Number(match[1]),
    oldLineCount: match[2] === undefined ? 1 : Number(match[2]),
    newStart: Number(match[3]),
    newLineCount: match[4] === undefined ? 1 : Number(match[4]),
    heading: match[5] ?? "",
    lines: [],
  };
}
