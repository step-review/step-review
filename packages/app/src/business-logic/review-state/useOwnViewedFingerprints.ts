import { useMemo } from "react";
import { useReviewState } from "./ReviewStateProvider.tsx";

/**
 * The files the own participant viewed: what their "Viewed" checkboxes show and
 * change.
 */
export default function useOwnViewedFingerprints(): Set<string> {
  const { reviewState } = useReviewState();
  return useMemo(
    () => new Set(reviewState.viewedFingerprints),
    [reviewState.viewedFingerprints],
  );
}
