import { useMemo } from "react";
import { useLoadedReviewContext } from "../review/LoadedReviewProvider.tsx";
import buildReviewView from "./buildReviewView.ts";

export default function useReviewView() {
  const { loadedReview } = useLoadedReviewContext();
  return useMemo(
    () =>
      loadedReview
        ? buildReviewView(loadedReview.reviewId, loadedReview.reviewFile)
        : null,
    [loadedReview],
  );
}
