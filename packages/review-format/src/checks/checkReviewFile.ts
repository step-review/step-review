import type ReviewFile from "../file/ReviewFile.ts";
import checkNoteAnchors from "./checkNoteAnchors.ts";
import collectNotes from "./collectNotes.ts";
import findFileDiff from "./findFileDiff.ts";
import findUnassignedFileDiffs from "./findUnassignedFileDiffs.ts";
import selectHunks from "./selectHunks.ts";

/**
 * Finds problems that do not prevent showing the review, but that the agent
 * should fix: steps and notes that don't match the diff, files in no step, and
 * duplicate IDs.
 */
export default function checkReviewFile(reviewFile: ReviewFile): string[] {
  const warnings: string[] = [];
  const stepIds = new Set<string>();
  for (const step of reviewFile.data.steps) {
    if (stepIds.has(step.id)) {
      warnings.push(`Step ID \`${step.id}\` is used more than once.`);
    }
    stepIds.add(step.id);
    for (const stepFile of step.files) {
      const fileDiff = findFileDiff(reviewFile.diff, stepFile.path);
      if (!fileDiff) {
        warnings.push(
          `Step \`${step.id}\` lists \`${stepFile.path}\`, which is not in the diff.`,
        );
        continue;
      }
      const hunks = selectHunks(fileDiff, stepFile.ranges);
      if (stepFile.ranges && hunks.length === 0) {
        warnings.push(
          `Step \`${step.id}\` selects no hunks of \`${stepFile.path}\`.`,
        );
      }
      warnings.push(...checkNoteAnchors(stepFile, hunks));
    }
  }
  const unassignedFileDiffs = findUnassignedFileDiffs(reviewFile);
  if (unassignedFileDiffs.length > 0) {
    warnings.push(
      `Files in no step: ${unassignedFileDiffs.map((fileDiff) => `\`${fileDiff.path}\``).join(", ")}.`,
    );
  }
  const noteIds = new Set<string>();
  for (const note of collectNotes(reviewFile)) {
    if (noteIds.has(note.id)) {
      warnings.push(`Note ID \`${note.id}\` is used more than once.`);
    }
    noteIds.add(note.id);
  }
  return warnings;
}
