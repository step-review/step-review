import type { FileNote, StepNote } from "@step-review/review-format";
import type StepView from "./StepView.ts";

/** The notes of the steps, including those of their files. */
export default function collectNotes(
  steps: StepView[],
): (StepNote | FileNote)[] {
  return steps.flatMap((step) => [
    ...step.notes,
    ...step.files.flatMap((file) => file.notes),
  ]);
}
