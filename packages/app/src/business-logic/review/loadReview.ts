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
  const { target } = result.reviewFile.data;
  // Reviews written again after the PR changed share the key, so files whose
  // changes are the same stay viewed.
  const reviewId = hashString(target.url ?? target.title);
  return {
    success: true,
    loadedReview: {
      reviewId,
      fileName,
      text,
      reviewFile: result.reviewFile,
      warnings: checkReviewFile(result.reviewFile),
    },
  };
}
