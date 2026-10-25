import { useMemo } from "react";
import { useReviewState } from "./ReviewStateProvider.tsx";

/** The files counted as viewed, by fingerprint. */
export default function useViewedFingerprints(): Set<string> {
  const { reviewState } = useReviewState();
  return useMemo(
    () => new Set(reviewState.viewedFingerprints),
    [reviewState.viewedFingerprints],
  );
}
