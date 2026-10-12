import type FileDiff from "../diff/FileDiff.ts";
import type ReviewRound from "../file/ReviewRound.ts";

/** Returns the files of the round's diff that no step lists. */
export default function findUnassignedFileDiffs(
  reviewRound: ReviewRound,
): FileDiff[] {
  const assignedPaths = new Set(
    reviewRound.data.steps.flatMap((step) =>
      step.files.map((stepFile) => stepFile.path),
    ),
  );
  return reviewRound.diff.filter(
    (fileDiff) => !assignedPaths.has(fileDiff.path),
  );
}
