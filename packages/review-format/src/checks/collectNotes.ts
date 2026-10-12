import type ReviewRound from "../file/ReviewRound.ts";
import type Note from "../round/types/Note.ts";

/** Returns every note of a round: step notes, then file notes, in order. */
export default function collectNotes(reviewRound: ReviewRound): Note[] {
  return reviewRound.data.steps.flatMap((step) => [
    ...(step.notes ?? []),
    ...step.files.flatMap((stepFile) => stepFile.notes ?? []),
  ]);
}
