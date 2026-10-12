import type { Attention, StepNote } from "@step-review/review-format";
import type StepFileView from "./StepFileView.ts";

export default interface StepView {
  id: string;
  /** 1-based position in the round. */
  number: number;
  /** `null` for the step of files that no step lists. */
  title: string | null;
  attention: Attention;
  intro: string | null;
  notes: StepNote[];
  files: StepFileView[];
}
