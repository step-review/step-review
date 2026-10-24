import { useMemo } from "react";
import { useLoadedReviewContext } from "../review/LoadedReviewValue.tsx";
import buildReviewView from "./buildReviewView.ts";

export default function useReviewView() {
  const { loadedReview, reviewAddress } = useLoadedReviewContext();
  return useMemo(
    () =>
      loadedReview && reviewAddress
        ? buildReviewView(reviewAddress, loadedReview.reviewFile)
        : null,
    [loadedReview, reviewAddress],
  );
}
