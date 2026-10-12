import { useMemo } from "react";
import { useReviewState } from "./ReviewStateProvider.tsx";

export default function useViewedFingerprints(): Set<string> {
  const { reviewState } = useReviewState();
  return useMemo(
    () => new Set(reviewState.viewedFingerprints),
    [reviewState.viewedFingerprints],
  );
}
