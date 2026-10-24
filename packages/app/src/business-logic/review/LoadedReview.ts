import type { ReviewFile } from "@step-review/review-format";

export default interface LoadedReview {
  /** Identifies the reviewed PR, in URLs and for state kept in the browser. */
  reviewId: string;
  fileName: string;
  reviewFile: ReviewFile;
  warnings: string[];
}
