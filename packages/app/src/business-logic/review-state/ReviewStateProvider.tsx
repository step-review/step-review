/* oxlint-disable architecture/public-exports -- Keep the review state context and its hook together. */
import { createContext, useContext, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import updateReviewState from "../review-store/updateReviewState.ts";
import useStoredReviewState from "../review-store/useStoredReviewState.ts";
import exampleReviewId from "../review/exampleReviewId.ts";
import emptyReviewState from "./emptyReviewState.ts";
import reduceReviewState from "./reduceReviewState.ts";
import type ReviewState from "./ReviewState.ts";
import type ReviewStateAction from "./ReviewStateAction.ts";

interface ReviewStateContextValue {
  reviewState: ReviewState;
  dispatch: (action: ReviewStateAction) => void;
}

const ReviewStateContext = createContext<ReviewStateContextValue>({
  reviewState: emptyReviewState(),
  dispatch: () => undefined,
});

interface Props {
  reviewId: string;
  children: ReactNode;
}

/**
 * Keeps the reviewer's state for one review, persisted in the browser. The
 * example review isn't stored, so its state is only kept in memory.
 */
export default function ReviewStateProvider({ reviewId, children }: Props) {
  return reviewId === exampleReviewId ? (
    <MemoryReviewStateProvider>{children}</MemoryReviewStateProvider>
  ) : (
    <StoredReviewStateProvider reviewId={reviewId}>
      {children}
    </StoredReviewStateProvider>
  );
}

interface MemoryReviewStateProviderProps {
  children: ReactNode;
}

function MemoryReviewStateProvider({
  children,
}: MemoryReviewStateProviderProps) {
  const [reviewState, dispatch] = useReducer(
    reduceReviewState,
    undefined,
    emptyReviewState,
  );
  const value = useMemo(() => ({ reviewState, dispatch }), [reviewState]);
  return <ReviewStateContext value={value}>{children}</ReviewStateContext>;
}

interface StoredReviewStateProviderProps {
  reviewId: string;
  children: ReactNode;
}

/** Renders its children once the state is read, so they don't show it empty. */
function StoredReviewStateProvider({
  reviewId,
  children,
}: StoredReviewStateProviderProps) {
  const reviewState = useStoredReviewState(reviewId);
  const value = useMemo(
    () =>
      reviewState && {
        reviewState,
        dispatch: (action: ReviewStateAction) => {
          void updateReviewState(reviewId, action);
        },
      },
    [reviewId, reviewState],
  );
  if (!value) {
    return null;
  }
  return <ReviewStateContext value={value}>{children}</ReviewStateContext>;
}

export function useReviewState() {
  return useContext(ReviewStateContext);
}
