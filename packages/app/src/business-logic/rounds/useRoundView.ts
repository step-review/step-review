import { useMemo } from "react";
import { useLoadedReviewContext } from "../review/LoadedReviewProvider.tsx";
import buildRoundView from "./buildRoundView.ts";

export default function useRoundView(roundNumber: number) {
  const { loadedReview } = useLoadedReviewContext();
  return useMemo(
    () =>
      loadedReview
        ? buildRoundView(loadedReview.reviewFile, roundNumber)
        : null,
    [loadedReview, roundNumber],
  );
}
