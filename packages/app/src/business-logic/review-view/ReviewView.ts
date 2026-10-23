import type { FileDiff, ReviewData } from "@step-review/review-format";
import type StepView from "./StepView.ts";

export default interface ReviewView {
  data: ReviewData;
  diff: FileDiff[];
  steps: StepView[];
}
