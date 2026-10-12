import {
  findFileDiff,
  findUnassignedFileDiffs,
  type ReviewFile,
} from "@step-review/review-format";
import buildStepFileView from "./buildStepFileView.ts";
import type RoundView from "./RoundView.ts";
import type StepFileView from "./StepFileView.ts";
import type StepView from "./StepView.ts";
import unassignedStepId from "./unassignedStepId.ts";

export default function buildRoundView(
  reviewFile: ReviewFile,
  roundNumber: number,
): RoundView | null {
  const round = reviewFile.rounds[roundNumber - 1];
  if (!round) {
    return null;
  }
  const previousRound = reviewFile.rounds[roundNumber - 2] ?? null;
  const steps: StepView[] = round.data.steps.map((step, index) => ({
    id: step.id,
    number: index + 1,
    title: step.title,
    attention: step.attention,
    intro: step.intro,
    notes: step.notes ?? [],
    files: step.files.flatMap((stepFile): StepFileView[] => {
      const fileDiff = findFileDiff(round.diff, stepFile.path);
      // Reported by the review checks; there is nothing to show.
      if (!fileDiff) {
        return [];
      }
      return [
        buildStepFileView(
          step.id,
          stepFile,
          fileDiff,
          previousRound,
          round.interdiff,
        ),
      ];
    }),
  }));
  const unassignedFileDiffs = findUnassignedFileDiffs(round);
  if (unassignedFileDiffs.length > 0) {
    steps.push({
      id: unassignedStepId,
      number: steps.length + 1,
      title: null,
      attention: "normal",
      intro: null,
      notes: [],
      files: unassignedFileDiffs.map((fileDiff) =>
        buildStepFileView(
          unassignedStepId,
          { path: fileDiff.path },
          fileDiff,
          previousRound,
          round.interdiff,
        ),
      ),
    });
  }
  const currentPaths = new Set(round.diff.map((fileDiff) => fileDiff.path));
  return {
    round,
    previousRound,
    steps,
    droppedPaths: (previousRound?.diff ?? [])
      .map((fileDiff) => fileDiff.path)
      .filter((path) => !currentPaths.has(path)),
  };
}
