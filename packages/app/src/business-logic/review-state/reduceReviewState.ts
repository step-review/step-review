import type ReviewState from "./ReviewState.ts";
import type ReviewStateAction from "./ReviewStateAction.ts";

export default function reduceReviewState(
  reviewState: ReviewState,
  action: ReviewStateAction,
): ReviewState {
  switch (action.type) {
    case "setViewed": {
      const viewedFingerprints = new Set(reviewState.viewedFingerprints);
      for (const fingerprint of action.fingerprints) {
        if (action.viewed) {
          viewedFingerprints.add(fingerprint);
        } else {
          viewedFingerprints.delete(fingerprint);
        }
      }
      return { ...reviewState, viewedFingerprints: [...viewedFingerprints] };
    }
    case "resetViewed":
      return { ...reviewState, viewedFingerprints: [] };
    case "setIssueVerdict":
      return {
        ...reviewState,
        issueVerdicts: {
          ...reviewState.issueVerdicts,
          [action.noteId]: action.issueVerdict,
        },
      };
    case "addComment":
      return {
        ...reviewState,
        comments: [...reviewState.comments, action.comment],
      };
    case "updateComment":
      return {
        ...reviewState,
        comments: reviewState.comments.map((comment) =>
          comment.id === action.commentId
            ? { ...comment, body: action.body }
            : comment,
        ),
      };
    case "deleteComment":
      return {
        ...reviewState,
        comments: reviewState.comments.filter(
          (comment) => comment.id !== action.commentId,
        ),
      };
    case "replace":
      return action.reviewState;
  }
}
