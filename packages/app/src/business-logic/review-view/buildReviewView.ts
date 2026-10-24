import {
  findFileDiff,
  findUnassignedFileDiffs,
  type ReviewFile,
} from "@step-review/review-format";
import buildStepFileView from "./buildStepFileView.ts";
import type ReviewView from "./ReviewView.ts";
import type StepFileView from "./StepFileView.ts";
import type StepView from "./StepView.ts";
import unassignedStepId from "./unassignedStepId.ts";

export default function buildReviewView(
  reviewId: string,
  reviewFile: ReviewFile,
): ReviewView {
  const steps: StepView[] = reviewFile.data.steps.map((step, index) => ({
    id: step.id,
    number: index + 1,
    title: step.title,
    attention: step.attention,
    intro: step.intro,
    notes: step.notes ?? [],
    files: step.files.flatMap((stepFile): StepFileView[] => {
      const fileDiff = findFileDiff(reviewFile.diff, stepFile.path);
      // Reported by the review checks; there is nothing to show.
      if (!fileDiff) {
        return [];
      }
      return [buildStepFileView(step.id, stepFile, fileDiff)];
    }),
  }));
  const unassignedFileDiffs = findUnassignedFileDiffs(reviewFile);
  if (unassignedFileDiffs.length > 0) {
    steps.push({
      id: unassignedStepId,
      number: steps.length + 1,
      title: null,
      attention: "normal",
      intro: null,
      notes: [],
      files: unassignedFileDiffs.map((fileDiff) =>
        buildStepFileView(unassignedStepId, { path: fileDiff.path }, fileDiff),
      ),
    });
  }
  return {
    reviewId,
    data: reviewFile.data,
    diff: reviewFile.diff,
    steps,
  };
}
