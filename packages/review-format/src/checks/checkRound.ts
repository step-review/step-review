import type ReviewRound from "../file/ReviewRound.ts";
import checkNoteAnchors from "./checkNoteAnchors.ts";
import findFileDiff from "./findFileDiff.ts";
import findUnassignedFileDiffs from "./findUnassignedFileDiffs.ts";
import selectHunks from "./selectHunks.ts";

/** Checks that a round's steps and notes are consistent with its diff. */
export default function checkRound(reviewRound: ReviewRound): string[] {
  const messages: string[] = [];
  const stepIds = new Set<string>();
  for (const step of reviewRound.data.steps) {
    if (stepIds.has(step.id)) {
      messages.push(`Step ID \`${step.id}\` is used more than once.`);
    }
    stepIds.add(step.id);
    for (const stepFile of step.files) {
      const fileDiff = findFileDiff(reviewRound.diff, stepFile.path);
      if (!fileDiff) {
        messages.push(
          `Step \`${step.id}\` lists \`${stepFile.path}\`, which is not in the diff.`,
        );
        continue;
      }
      const hunks = selectHunks(fileDiff, stepFile.ranges);
      if (stepFile.ranges && hunks.length === 0) {
        messages.push(
          `Step \`${step.id}\` selects no hunks of \`${stepFile.path}\`.`,
        );
      }
      messages.push(...checkNoteAnchors(stepFile, hunks));
    }
  }
  const unassignedFileDiffs = findUnassignedFileDiffs(reviewRound);
  if (unassignedFileDiffs.length > 0) {
    messages.push(
      `Files in no step: ${unassignedFileDiffs.map((fileDiff) => `\`${fileDiff.path}\``).join(", ")}.`,
    );
  }
  if (reviewRound.number === 1 && reviewRound.data.previousRound) {
    messages.push("The first round has a `previousRound` section.");
  }
  if (reviewRound.number > 1 && !reviewRound.data.previousRound) {
    messages.push("The round has no `previousRound` section.");
  }
  if (reviewRound.number === 1 && reviewRound.interdiff) {
    messages.push("The first round has an interdiff.");
  }
  return messages;
}
