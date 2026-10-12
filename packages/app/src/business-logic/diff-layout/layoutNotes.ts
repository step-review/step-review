import type NoteBox from "./NoteBox.ts";

/**
 * Places notes as close as possible to their anchors without overlapping: each
 * note goes at its anchor's top or right below the previous note.
 */
export default function layoutNotes(
  noteBoxes: NoteBox[],
  gap: number,
): { tops: Map<string, number>; bottom: number } {
  const tops = new Map<string, number>();
  let bottom = 0;
  const sortedNoteBoxes = [...noteBoxes].sort(
    (first, second) => first.anchorTop - second.anchorTop,
  );
  for (const noteBox of sortedNoteBoxes) {
    const top = Math.max(noteBox.anchorTop, tops.size > 0 ? bottom + gap : 0);
    tops.set(noteBox.id, top);
    bottom = top + noteBox.height;
  }
  return { tops, bottom };
}
