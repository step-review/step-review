import {
  selectHunks,
  type FileDiff,
  type StepFile,
} from "@step-review/review-format";
import fingerprintHunks from "./fingerprintHunks.ts";
import type StepFileView from "./StepFileView.ts";

export default function buildStepFileView(
  stepId: string,
  stepFile: StepFile,
  fileDiff: FileDiff,
): StepFileView {
  const hunks = selectHunks(fileDiff, stepFile.ranges);
  const lines = hunks.flatMap((hunk) => hunk.lines);
  return {
    id: `${stepId}:${fileDiff.path}`,
    path: fileDiff.path,
    fileDiff,
    hunks,
    additions: lines.filter((line) => line.type === "addition").length,
    deletions: lines.filter((line) => line.type === "deletion").length,
    summary: stepFile.summary ?? null,
    notes: stepFile.notes ?? [],
    fingerprint: fingerprintHunks(fileDiff, hunks),
  };
}
