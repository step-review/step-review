import {
  findFileDiff,
  selectHunks,
  type FileDiff,
  type ReviewRound,
  type StepFile,
} from "@step-review/review-format";
import type FileChange from "./FileChange.ts";
import fingerprintHunks from "./fingerprintHunks.ts";
import type StepFileView from "./StepFileView.ts";

export default function buildStepFileView(
  stepId: string,
  stepFile: StepFile,
  fileDiff: FileDiff,
  previousRound: ReviewRound | null,
  interdiff: FileDiff[] | null,
): StepFileView {
  const hunks = selectHunks(fileDiff, stepFile.ranges);
  const lines = hunks.flatMap((hunk) => hunk.lines);
  const interdiffFileDiff = interdiff && findFileDiff(interdiff, fileDiff.path);
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
    change: compareWithPreviousRound(fileDiff, previousRound),
    interdiffHunks: interdiffFileDiff?.hunks ?? null,
  };
}

function compareWithPreviousRound(
  fileDiff: FileDiff,
  previousRound: ReviewRound | null,
): FileChange {
  if (!previousRound) {
    return null;
  }
  const previousFileDiff = findFileDiff(previousRound.diff, fileDiff.path);
  if (!previousFileDiff) {
    return "new";
  }
  return fingerprintHunks(previousFileDiff, previousFileDiff.hunks) ===
    fingerprintHunks(fileDiff, fileDiff.hunks)
    ? null
    : "changed";
}
