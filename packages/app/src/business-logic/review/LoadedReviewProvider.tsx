/* oxlint-disable architecture/public-exports -- Keep the review context and its hook together. */
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import routeReviewId from "../navigation/routeReviewId.ts";
import useNavigationState from "../navigation/useNavigationState.ts";
import useStoredLoadedReview from "../review-store/useStoredLoadedReview.ts";
import exampleReviewId from "./exampleReviewId.ts";
import type LoadedReview from "./LoadedReview.ts";
import useExampleLoadedReview from "./useExampleLoadedReview.ts";

interface LoadedReviewContextValue {
  /**
   * The review the URL names: `null` when it names none or the review isn't
   * stored, `undefined` while it is read.
   */
  loadedReview: LoadedReview | null | undefined;
}

const LoadedReviewContext = createContext<LoadedReviewContextValue>({
  loadedReview: null,
});

interface Props {
  children: ReactNode;
}

/**
 * Provides the review the URL names, loaded from the browser's storage, or the
 * example review served with the app.
 */
export default function LoadedReviewProvider({ children }: Props) {
  const reviewId = routeReviewId(useNavigationState());
  if (reviewId === null) {
    return (
      <LoadedReviewValue loadedReview={null}>{children}</LoadedReviewValue>
    );
  }
  // Keyed, so that another review starts out as being read rather than showing
  // the previous one.
  if (reviewId === exampleReviewId) {
    return (
      <ExampleReviewProvider key={reviewId}>{children}</ExampleReviewProvider>
    );
  }
  return (
    <StoredReviewProvider key={reviewId} reviewId={reviewId}>
      {children}
    </StoredReviewProvider>
  );
}

interface ExampleReviewProviderProps {
  children: ReactNode;
}

function ExampleReviewProvider({ children }: ExampleReviewProviderProps) {
  const loadedReview = useExampleLoadedReview();
  return (
    <LoadedReviewValue loadedReview={loadedReview}>
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
  return (
    <LoadedReviewValue loadedReview={loadedReview}>
      {children}
    </LoadedReviewValue>
  );
}

interface LoadedReviewValueProps {
  loadedReview: LoadedReview | null | undefined;
  children: ReactNode;
}

function LoadedReviewValue({ loadedReview, children }: LoadedReviewValueProps) {
  const value = useMemo(() => ({ loadedReview }), [loadedReview]);
  return <LoadedReviewContext value={value}>{children}</LoadedReviewContext>;
}

export function useLoadedReviewContext() {
  return useContext(LoadedReviewContext);
}
