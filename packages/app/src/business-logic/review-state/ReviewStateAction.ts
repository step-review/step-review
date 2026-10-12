import type IssueVerdict from "./IssueVerdict.ts";
import type ReviewerComment from "./ReviewerComment.ts";
import type ReviewState from "./ReviewState.ts";

type ReviewStateAction =
  | { type: "setViewed"; fingerprints: string[]; viewed: boolean }
  | { type: "resetViewed" }
  | { type: "setIssueVerdict"; noteId: string; issueVerdict: IssueVerdict }
  | { type: "addComment"; comment: ReviewerComment }
  | { type: "updateComment"; commentId: string; body: string }
  | { type: "deleteComment"; commentId: string }
  | { type: "replace"; reviewState: ReviewState };

export default ReviewStateAction;
