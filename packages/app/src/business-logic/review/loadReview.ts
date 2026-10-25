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
  return {
    success: true,
    loadedReview: {
      // Every review file is a review of its own, even of the same PR: opening
      // the same file again opens the same review.
      reviewId: hashString(text),
      fileName,
      text,
      reviewFile: result.reviewFile,
      warnings: checkReviewFile(result.reviewFile),
    },
  };
}
