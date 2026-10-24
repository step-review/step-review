/* oxlint-disable architecture/public-exports -- Keep the review context and its hook together. */
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type ReviewAddress from "../navigation/ReviewAddress.ts";
import type LoadedReview from "./LoadedReview.ts";

interface LoadedReviewContextValue {
  /**
   * The review the URL names: `null` when it names none or the review can't be
   * loaded, `undefined` while it is.
   */
  loadedReview: LoadedReview | null | undefined;
  /** Where the review is, for the routes to its pages. */
  reviewAddress: ReviewAddress | null;
}

const LoadedReviewContext = createContext<LoadedReviewContextValue>({
  loadedReview: null,
  reviewAddress: null,
});

interface Props extends LoadedReviewContextValue {
  children: ReactNode;
}

/** Provides a loaded review, whatever its source. */
export default function LoadedReviewValue({
  loadedReview,
  reviewAddress,
  children,
}: Props) {
  const value = useMemo(
    () => ({ loadedReview, reviewAddress }),
    [loadedReview, reviewAddress],
  );
  return <LoadedReviewContext value={value}>{children}</LoadedReviewContext>;
}

export function useLoadedReviewContext() {
  return useContext(LoadedReviewContext);
}
