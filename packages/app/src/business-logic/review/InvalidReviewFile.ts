import type { ReviewFileProblem } from "@step-review/review-format";

/** A file that could not be opened as a review. */
export default interface InvalidReviewFile {
  fileName: string;
  problems: ReviewFileProblem[];
}
