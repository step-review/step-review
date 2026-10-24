import type { FileDiff, ReviewData } from "@step-review/review-format";
import type StepView from "./StepView.ts";

export default interface ReviewView {
  /** The ID of the loaded review, for the routes to its pages. */
  reviewId: string;
  data: ReviewData;
  diff: FileDiff[];
  steps: StepView[];
}
