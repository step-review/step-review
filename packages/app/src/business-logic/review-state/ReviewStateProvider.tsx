/* oxlint-disable architecture/public-exports -- Keep the review state context and its hook together. */
import { createContext, useContext, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import type ReviewAddress from "../navigation/ReviewAddress.ts";
import updateReviewState from "../review-store/updateReviewState.ts";
import useStoredReviewState from "../review-store/useStoredReviewState.ts";
import exampleReviewId from "../review/exampleReviewId.ts";
import { useShareSessionContext } from "../share-session/ShareSessionProvider.tsx";
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
  reviewAddress: ReviewAddress;
  children: ReactNode;
}

/**
 * Keeps the reviewer's state for one review: persisted in the browser, or by
 * the share for a shared review. The example review isn't stored, so its state
 * is only kept in memory.
 */
export default function ReviewStateProvider({
  reviewAddress,
  children,
}: Props) {
  if (reviewAddress.kind === "shared") {
    return <SharedReviewStateProvider>{children}</SharedReviewStateProvider>;
  }
  return reviewAddress.reviewId === exampleReviewId ? (
    <MemoryReviewStateProvider>{children}</MemoryReviewStateProvider>
  ) : (
    <StoredReviewStateProvider reviewId={reviewAddress.reviewId}>
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

interface SharedReviewStateProviderProps {
  children: ReactNode;
}

/** The participant's own state in the share being displayed. */
function SharedReviewStateProvider({
  children,
}: SharedReviewStateProviderProps) {
  const shareSessionContext = useShareSessionContext();
  const shareSession = shareSessionContext?.shareSession;
  const viewedFingerprints =
    shareSessionContext?.shareSessionSnapshot.ownState.viewedFingerprints;
  const value = useMemo(
    () =>
      shareSession &&
      viewedFingerprints && {
        reviewState: { viewedFingerprints },
        dispatch: (action: ReviewStateAction) => shareSession.dispatch(action),
      },
    [shareSession, viewedFingerprints],
  );
  // The review only loads within its share session.
  if (!value) {
    return null;
  }
  return <ReviewStateContext value={value}>{children}</ReviewStateContext>;
}

export function useReviewState() {
  return useContext(ReviewStateContext);
}
