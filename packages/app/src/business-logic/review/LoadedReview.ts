import type { ReviewFile, ReviewFileWarning } from "@step-review/review-format";

export default interface LoadedReview {
  fileName: string;
  reviewFile: ReviewFile;
  warnings: ReviewFileWarning[];
  /** Identifies the review across rounds, for state kept in the browser. */
  storageKey: string;
}
