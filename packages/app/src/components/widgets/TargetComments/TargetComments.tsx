import { Stack } from "@mantine/core";
import type CommentTarget from "../../../business-logic/review-state/CommentTarget.ts";
import createCommentId from "../../../business-logic/review-state/createCommentId.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import CommentCard from "../CommentCard/CommentCard.tsx";
import CommentEditor from "../CommentEditor/CommentEditor.tsx";

interface Props {
  roundNumber: number;
  /** A step or file target: what the comments are about. */
  target: Exclude<CommentTarget, { kind: "line" }>;
  isAdding: boolean;
  onAddingDone: () => void;
}

/** The reviewer's comments on a step or a file, and the editor for a new one. */
export default function TargetComments({
  roundNumber,
  target,
  isAdding,
  onAddingDone,
}: Props) {
  const { reviewState, dispatch } = useReviewState();
  const comments = reviewState.comments.filter(
    (comment) =>
      comment.roundNumber === roundNumber &&
      comment.target.kind === target.kind &&
      comment.target.stepId === target.stepId &&
      (target.kind === "step" ||
        (comment.target.kind === "file" &&
          comment.target.path === target.path)),
  );
  if (comments.length === 0 && !isAdding) {
    return null;
  }
  return (
    <Stack gap={6}>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      {isAdding && (
        <CommentEditor
          onCancel={onAddingDone}
          onSave={(body) => {
            dispatch({
              type: "addComment",
              comment: {
                id: createCommentId(),
                roundNumber,
                target,
                body,
                createdAt: new Date().toISOString(),
              },
            });
            onAddingDone();
          }}
        />
      )}
    </Stack>
  );
}
