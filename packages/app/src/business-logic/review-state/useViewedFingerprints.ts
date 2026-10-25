import { useMemo } from "react";
import { useShareSessionContext } from "../share-session/ShareSessionProvider.tsx";
import mergeViewedFingerprints from "./mergeViewedFingerprints.ts";
import { useReviewState } from "./ReviewStateProvider.tsx";

/**
 * The files counted as viewed, e.g. in progress: in a shared review, those that
 * any participant viewed. See `useOwnViewedFingerprints` for the own ones.
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
