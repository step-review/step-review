import type { Note } from "@step-review/review-format";

/** `path:line` (or `path:start-end`) of a note, as coding agents read it. */
export default function formatNoteLocation(note: Note, path: string): string {
  if (!("anchor" in note) || !note.anchor) {
    return path;
  }
  const { line, endLine } = note.anchor;
  return endLine !== undefined && endLine !== line
    ? `${path}:${line}-${endLine}`
    : `${path}:${line}`;
}
