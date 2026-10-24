import type { FileDiff, ReviewData } from "@step-review/review-format";
import type ReviewAddress from "../navigation/ReviewAddress.ts";
import type StepView from "./StepView.ts";

export default interface ReviewView {
  /** Where the loaded review is, for the routes to its pages. */
  reviewAddress: ReviewAddress;
  data: ReviewData;
  diff: FileDiff[];
  steps: StepView[];
}
