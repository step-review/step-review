import type FileDiff from "../diff/FileDiff.ts";
import type ReviewFile from "../file/ReviewFile.ts";

/** Returns the files of the review's diff that no step lists. */
export default function findUnassignedFileDiffs(
  reviewFile: ReviewFile,
): FileDiff[] {
  const assignedPaths = new Set(
    reviewFile.data.steps.flatMap((step) =>
      step.files.map((stepFile) => stepFile.path),
    ),
  );
  return reviewFile.diff.filter(
    (fileDiff) => !assignedPaths.has(fileDiff.path),
  );
}
