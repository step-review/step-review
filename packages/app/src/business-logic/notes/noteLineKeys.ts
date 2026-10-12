import type { Note } from "@step-review/review-format";

/** Line keys (see `lineKeys`) of the lines a note is anchored to. */
export default function noteLineKeys(note: Note): string[] {
  if (!("anchor" in note) || !note.anchor) {
    return [];
  }
  const { side, line, endLine = line } = note.anchor;
  const keys: string[] = [];
  for (
    let lineNumber = line;
    lineNumber <= Math.max(line, endLine);
    lineNumber++
  ) {
    keys.push(`${side}:${lineNumber}`);
  }
  return keys;
}
