import {
  checkReviewFile,
  parseReviewFile,
  type ReviewFileProblem,
} from "@step-review/review-format";
import hashString from "./hashString.ts";
import type LoadedReview from "./LoadedReview.ts";

export default function loadReview(
  fileName: string,
  text: string,
):
  | { success: true; loadedReview: LoadedReview }
  | { success: false; problems: ReviewFileProblem[] } {
  const result = parseReviewFile(text);
  if (!result.success) {
    return result;
  }
  const firstRound = result.reviewFile.rounds[0]!.data;
  // Later rounds are appended, so the first one identifies the review.
  const storageKey = hashString(
    JSON.stringify([
      firstRound.target.url ?? firstRound.target.title,
      firstRound.target.baseCommit,
      firstRound.createdAt,
    ]),
  );
  return {
    success: true,
    loadedReview: {
      fileName,
      reviewFile: result.reviewFile,
      warnings: checkReviewFile(result.reviewFile),
      storageKey,
    },
  };
}
