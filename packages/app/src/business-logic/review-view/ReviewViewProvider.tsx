/* oxlint-disable architecture/public-exports -- Keep the review view context and its hook together. */
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type ReviewView from "./ReviewView.ts";

const ReviewViewContext = createContext<ReviewView | null>(null);

interface Props {
  reviewView: ReviewView;
  children: ReactNode;
}

/** Provides the review being displayed to the components of a review page. */
export default function ReviewViewProvider({ reviewView, children }: Props) {
  return <ReviewViewContext value={reviewView}>{children}</ReviewViewContext>;
}

export function useCurrentReviewView(): ReviewView {
  const reviewView = useContext(ReviewViewContext);
  if (!reviewView) {
    throw new Error(
      "useCurrentReviewView must be used inside ReviewViewProvider.",
    );
  }
  return reviewView;
}
