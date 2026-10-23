import type { ReviewFile } from "@step-review/review-format";

export default interface LoadedReview {
  fileName: string;
  reviewFile: ReviewFile;
  warnings: string[];
  /** Identifies the reviewed PR, for state kept in the browser. */
  storageKey: string;
}
