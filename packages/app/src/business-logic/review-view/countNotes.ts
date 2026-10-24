import type { FileNote, StepNote } from "@step-review/review-format";
import type NoteKindCounts from "./NoteKindCounts.ts";

/** How many of the notes are issues of each severity, and how many explainers. */
export default function countNotes(
  notes: (StepNote | FileNote)[],
): NoteKindCounts {
  const noteKindCounts: NoteKindCounts = {
    issueCountsBySeverity: { blocker: 0, concern: 0, question: 0, nit: 0 },
    explainerCount: 0,
  };
  for (const note of notes) {
    if (note.kind === "issue") {
      noteKindCounts.issueCountsBySeverity[note.severity] += 1;
    } else {
      noteKindCounts.explainerCount += 1;
    }
  }
  return noteKindCounts;
}
