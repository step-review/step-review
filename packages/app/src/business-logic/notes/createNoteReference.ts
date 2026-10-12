import type NoteLocation from "../rounds/NoteLocation.ts";
import formatNoteLocation from "./formatNoteLocation.ts";

/**
 * Text copied from a note, to paste into a conversation with a coding agent. It
 * is self-contained, so agents that did not write the review need no lookup.
 */
export default function createNoteReference(
  fileName: string,
  noteLocation: NoteLocation,
): string {
  const { note, roundNumber, stepId, path } = noteLocation;
  const kind = note.kind === "issue" ? `Issue (${note.severity})` : "Note";
  const isOldSide = "anchor" in note && note.anchor?.side === "old";
  const location =
    path === null
      ? `step \`${stepId}\``
      : `\`${formatNoteLocation(note, path)}\`${isOldSide ? " (base version)" : ""}`;
  return [
    `${kind} \`${note.id}\` from \`${fileName}\` (round ${roundNumber}), on ${location}:`,
    "",
    note.body,
  ].join("\n");
}
