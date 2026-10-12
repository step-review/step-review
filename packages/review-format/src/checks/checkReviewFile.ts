import type ReviewFile from "../file/ReviewFile.ts";
import type Note from "../round/types/Note.ts";
import checkRound from "./checkRound.ts";
import collectNotes from "./collectNotes.ts";
import type ReviewFileWarning from "./ReviewFileWarning.ts";

/**
 * Finds problems that do not prevent showing the review, but that the agent
 * should fix: steps and notes that don't match the diff, files in no step,
 * duplicate IDs, and references to unknown issues.
 */
export default function checkReviewFile(
  reviewFile: ReviewFile,
): ReviewFileWarning[] {
  const warnings: ReviewFileWarning[] = [];
  const earlierNotes = new Map<string, Note>();
  for (const reviewRound of reviewFile.rounds) {
    const roundNumber = reviewRound.number;
    for (const message of checkRound(reviewRound)) {
      warnings.push({ roundNumber, message });
    }
    for (const issue of reviewRound.data.previousRound?.issues ?? []) {
      if (earlierNotes.get(issue.noteId)?.kind !== "issue") {
        warnings.push({
          roundNumber,
          message: `\`previousRound\` refers to \`${issue.noteId}\`, which is not an issue of a previous round.`,
        });
      }
    }
    for (const note of collectNotes(reviewRound)) {
      if (earlierNotes.has(note.id)) {
        warnings.push({
          roundNumber,
          message: `Note ID \`${note.id}\` is used more than once.`,
        });
      }
      earlierNotes.set(note.id, note);
    }
  }
  return warnings;
}
