import {
  findDiffLine,
  type FileNote,
  type Hunk,
} from "@step-review/review-format";

/**
 * Separates notes anchored to a line of the hunks from the others, which are
 * shown at the file level (including notes whose anchor matches no line).
 */
export default function splitFileNotes(
  notes: FileNote[],
  hunks: Hunk[],
): { lineNotes: FileNote[]; fileNotes: FileNote[] } {
  const lineNotes: FileNote[] = [];
  const fileNotes: FileNote[] = [];
  for (const note of notes) {
    if (
      note.anchor &&
      findDiffLine(hunks, note.anchor.side, note.anchor.line)
    ) {
      lineNotes.push(note);
    } else {
      fileNotes.push(note);
    }
  }
  return { lineNotes, fileNotes };
}
