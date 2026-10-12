import type { ReviewRound } from "@step-review/review-format";
import type StepView from "./StepView.ts";

export default interface RoundView {
  round: ReviewRound;
  previousRound: ReviewRound | null;
  steps: StepView[];
  /** Files in the previous round's diff that are no longer in the PR. */
  droppedPaths: string[];
}
