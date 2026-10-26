import { useMemo } from "react";
import type { ReactNode } from "react";
import type ReviewAddress from "../navigation/ReviewAddress.ts";
import reviewAddressId from "../navigation/reviewAddressId.ts";
import routeReviewAddress from "../navigation/routeReviewAddress.ts";
import useNavigationState from "../navigation/useNavigationState.ts";
import useStoredLoadedReview from "../review-store/useStoredLoadedReview.ts";
import SessionReviewProvider from "../session/SessionReviewProvider.tsx";
import exampleReviewId from "./exampleReviewId.ts";
import LoadedReviewValue from "./LoadedReviewValue.tsx";
import useExampleLoadedReview from "./useExampleLoadedReview.ts";

interface Props {
  children: ReactNode;
}

/**
 * Provides the review the URL names: loaded from the browser's storage, the
 * example review served with the app, or a session's review from the server.
 */
export default function LoadedReviewProvider({ children }: Props) {
  const reviewAddress = routeReviewAddress(useNavigationState());
  if (reviewAddress === null) {
    return (
      <LoadedReviewValue loadedReview={null} reviewAddress={null}>
        {children}
      </LoadedReviewValue>
    );
  }
  // Keyed, so that another review starts out as being read rather than showing
  // the previous one.
  const key = reviewAddressId(reviewAddress);
  if (reviewAddress.kind === "session") {
    return (
      <SessionReviewProvider key={key} reviewAddress={reviewAddress}>
        {children}
      </SessionReviewProvider>
    );
  }
  if (reviewAddress.reviewId === exampleReviewId) {
    return <ExampleReviewProvider key={key}>{children}</ExampleReviewProvider>;
  }
  return (
    <StoredReviewProvider key={key} reviewId={reviewAddress.reviewId}>
      {children}
    </StoredReviewProvider>
  );
}

interface ExampleReviewProviderProps {
  children: ReactNode;
}

function ExampleReviewProvider({ children }: ExampleReviewProviderProps) {
  const loadedReview = useExampleLoadedReview();
  const reviewAddress = useLocalReviewAddress(exampleReviewId);
  return (
    <LoadedReviewValue
      loadedReview={loadedReview}
      reviewAddress={reviewAddress}
    >
      {children}
    </LoadedReviewValue>
  );
}

interface StoredReviewProviderProps {
  reviewId: string;
  children: ReactNode;
}

function StoredReviewProvider({
  reviewId,
  children,
}: StoredReviewProviderProps) {
  const loadedReview = useStoredLoadedReview(reviewId);
  const reviewAddress = useLocalReviewAddress(reviewId);
  return (
    <LoadedReviewValue
      loadedReview={loadedReview}
      reviewAddress={reviewAddress}
    >
      {children}
    </LoadedReviewValue>
  );
}

/**
 * The address of a local review, kept the same object across renders: the
 * route's changes with the fragment, which doesn't change the review.
 */
function useLocalReviewAddress(reviewId: string): ReviewAddress {
  return useMemo(() => ({ kind: "local", reviewId }), [reviewId]);
}
