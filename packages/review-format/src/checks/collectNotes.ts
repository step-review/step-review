import type Note from "../data/types/Note.ts";
import type ReviewFile from "../file/ReviewFile.ts";

/** Returns every note of the review: step notes, then file notes, in order. */
export default function collectNotes(reviewFile: ReviewFile): Note[] {
  return reviewFile.data.steps.flatMap((step) => [
    ...(step.notes ?? []),
    ...step.files.flatMap((stepFile) => stepFile.notes ?? []),
  ]);
}
