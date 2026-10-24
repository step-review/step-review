import { useLiveQuery } from "dexie-react-hooks";
import emptyReviewState from "../review-state/emptyReviewState.ts";
import type ReviewState from "../review-state/ReviewState.ts";
import reviewDatabase from "./reviewDatabase.ts";

/** The stored state of a review; `undefined` while it is read. */
export default function useStoredReviewState(
  reviewId: string,
): ReviewState | undefined {
  return useLiveQuery(
    async () =>
      (await reviewDatabase.reviewStates.get(reviewId)) ?? emptyReviewState(),
    [reviewId],
  );
}
