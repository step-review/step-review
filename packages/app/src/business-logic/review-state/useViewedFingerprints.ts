import { useMemo } from "react";
import { useShareSessionContext } from "../share-session/ShareSessionProvider.tsx";
import mergeViewedFingerprints from "./mergeViewedFingerprints.ts";
import { useReviewState } from "./ReviewStateProvider.tsx";

/**
 * The files counted as viewed: in a shared review, those that any participant
 * viewed. Changes only apply to the own state, through `useReviewState`.
 */
export default function useViewedFingerprints(): Set<string> {
  const { reviewState } = useReviewState();
  const otherParticipantStates =
    useShareSessionContext()?.shareSessionSnapshot.otherParticipantStates;
  return useMemo(
    () =>
      mergeViewedFingerprints(
        reviewState.viewedFingerprints,
        otherParticipantStates?.values() ?? [],
      ),
    [reviewState.viewedFingerprints, otherParticipantStates],
  );
}
