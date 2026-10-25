/* oxlint-disable architecture/public-exports -- Keep the review state context and its hook together. */
import { createContext, useContext, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import type ReviewAddress from "../navigation/ReviewAddress.ts";
import updateReviewState from "../review-store/updateReviewState.ts";
import useStoredReviewState from "../review-store/useStoredReviewState.ts";
import exampleReviewId from "../review/exampleReviewId.ts";
import { useSessionConnectionContext } from "../session-connection/SessionConnectionProvider.tsx";
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
 * the session's server for a session. The example review isn't stored, so its
 * state is only kept in memory.
 */
export default function ReviewStateProvider({
  reviewAddress,
  children,
}: Props) {
  if (reviewAddress.kind === "session") {
    return <SessionReviewStateProvider>{children}</SessionReviewStateProvider>;
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

interface SessionReviewStateProviderProps {
  children: ReactNode;
}

/** The state of the session being displayed, shared by every participant. */
function SessionReviewStateProvider({
  children,
}: SessionReviewStateProviderProps) {
  const sessionConnectionContext = useSessionConnectionContext();
  const sessionConnection = sessionConnectionContext?.sessionConnection;
  const fileViewedStatuses =
    sessionConnectionContext?.sessionConnectionSnapshot.fileViewedStatuses;
  const value = useMemo(
    () =>
      sessionConnection &&
      fileViewedStatuses && {
        reviewState: {
          viewedFingerprints: [...fileViewedStatuses]
            .filter(([, fileViewedStatus]) => fileViewedStatus.viewed)
            .map(([fingerprint]) => fingerprint),
        },
        dispatch: (action: ReviewStateAction) =>
          sessionConnection.dispatch(action),
      },
    [sessionConnection, fileViewedStatuses],
  );
  // The review only loads within its session connection.
  if (!value) {
    return null;
  }
  return <ReviewStateContext value={value}>{children}</ReviewStateContext>;
}

export function useReviewState() {
  return useContext(ReviewStateContext);
}
