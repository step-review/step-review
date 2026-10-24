import type { ReactNode } from "react";
import { useLoadedReviewContext } from "../review/LoadedReviewProvider.tsx";
import ReviewStateProvider from "./ReviewStateProvider.tsx";

interface Props {
  children: ReactNode;
}

/** Provides the reviewer's state for the loaded review, if any. */
export default function LoadedReviewStateProvider({ children }: Props) {
  const { loadedReview } = useLoadedReviewContext();
  if (!loadedReview) {
    return children;
  }
  return (
    <ReviewStateProvider
      key={loadedReview.reviewId}
      reviewId={loadedReview.reviewId}
    >
      {children}
    </ReviewStateProvider>
  );
}
