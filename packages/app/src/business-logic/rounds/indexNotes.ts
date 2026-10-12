import type { ReviewFile } from "@step-review/review-format";
import type NoteLocation from "./NoteLocation.ts";

/** Indexes every note of the review by ID. Later rounds win on duplicates. */
export default function indexNotes(
  reviewFile: ReviewFile,
): Map<string, NoteLocation> {
  const noteLocations = new Map<string, NoteLocation>();
  for (const round of reviewFile.rounds) {
    for (const step of round.data.steps) {
      for (const note of step.notes ?? []) {
        noteLocations.set(note.id, {
          note,
          roundNumber: round.number,
          stepId: step.id,
          path: null,
        });
      }
      for (const stepFile of step.files) {
        for (const note of stepFile.notes ?? []) {
          noteLocations.set(note.id, {
            note,
            roundNumber: round.number,
            stepId: step.id,
            path: stepFile.path,
          });
        }
      }
    }
  }
  return noteLocations;
}
