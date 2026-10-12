import formatNoteLocation from "../notes/formatNoteLocation.ts";
import type ReviewState from "../review-state/ReviewState.ts";
import type LoadedReview from "../review/LoadedReview.ts";
import type NoteLocation from "../rounds/NoteLocation.ts";
import formatCommentTarget from "./formatCommentTarget.ts";
import quoteMarkdown from "./quoteMarkdown.ts";

/**
 * The reviewer's feedback as Markdown, ready to paste into a conversation with
 * a coding agent or into a PR comment.
 */
export default function exportFeedbackMarkdown(
  loadedReview: LoadedReview,
  reviewState: ReviewState,
  noteIndex: Map<string, NoteLocation>,
): string {
  const latestRound = loadedReview.reviewFile.rounds.at(-1)!;
  const sections = [
    `# Feedback on "${latestRound.data.target.title}"`,
    `From the step-review in \`${loadedReview.fileName}\`.`,
  ];
  const issueItems = Object.entries(reviewState.issueVerdicts).flatMap(
    ([noteId, issueVerdict]) => {
      const noteLocation = noteIndex.get(noteId);
      if (
        !noteLocation ||
        (!issueVerdict.verdict && !issueVerdict.reply.trim())
      ) {
        return [];
      }
      const { note, path, stepId } = noteLocation;
      const verdict =
        issueVerdict.verdict === "accepted"
          ? "Accepted"
          : issueVerdict.verdict === "dismissed"
            ? "Dismissed"
            : "Replied to";
      const location =
        path === null
          ? `step \`${stepId}\``
          : `\`${formatNoteLocation(note, path)}\``;
      return [
        [
          `- ${verdict} issue \`${noteId}\` on ${location}:`,
          quoteMarkdown(note.body),
          ...(issueVerdict.reply.trim()
            ? [`  Reply: ${issueVerdict.reply.trim()}`]
            : []),
        ].join("\n"),
      ];
    },
  );
  if (issueItems.length > 0) {
    sections.push(
      ["## Issues raised by the review", ...issueItems].join("\n\n"),
    );
  }
  const commentItems = reviewState.comments
    .filter((comment) => comment.body.trim())
    .map((comment) =>
      [
        `- On ${formatCommentTarget(comment.target)} (round ${comment.roundNumber}): ${comment.body.trim()}`,
        ...(comment.target.kind === "line"
          ? [quoteMarkdown(comment.target.lineText)]
          : []),
      ].join("\n"),
    );
  if (commentItems.length > 0) {
    sections.push(["## Comments", ...commentItems].join("\n\n"));
  }
  if (issueItems.length === 0 && commentItems.length === 0) {
    sections.push("No feedback yet.");
  }
  return `${sections.join("\n\n")}\n`;
}
