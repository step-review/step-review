import emptyReviewState from "../review-state/emptyReviewState.ts";
import reduceReviewState from "../review-state/reduceReviewState.ts";
import type ReviewStateAction from "../review-state/ReviewStateAction.ts";
import reviewDatabase from "./reviewDatabase.ts";

/**
 * Applies an action to a stored review state. Reading and writing in one
 * transaction keeps quick successive actions from overwriting each other.
 */
export default async function updateReviewState(
  reviewId: string,
  action: ReviewStateAction,
): Promise<void> {
  await reviewDatabase.transaction(
    "rw",
    reviewDatabase.reviewStates,
    async () => {
      const reviewState =
        (await reviewDatabase.reviewStates.get(reviewId)) ?? emptyReviewState();
      await reviewDatabase.reviewStates.put(
        reduceReviewState(reviewState, action),
        reviewId,
      );
    },
  );
}
