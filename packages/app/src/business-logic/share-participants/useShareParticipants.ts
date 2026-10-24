import { useMemo } from "react";
import { useCurrentReviewView } from "../review-view/ReviewViewProvider.tsx";
import { useShareSessionContext } from "../share-session/ShareSessionProvider.tsx";
import buildShareParticipants from "./buildShareParticipants.ts";
import type ShareParticipantView from "./ShareParticipantView.ts";

/** The participants of the shared review displayed; `null` for local ones. */
export default function useShareParticipants(): ShareParticipantView[] | null {
  const shareSessionContext = useShareSessionContext();
  const { steps } = useCurrentReviewView();
  return useMemo(
    () =>
      shareSessionContext &&
      buildShareParticipants(
        shareSessionContext.shareSessionSnapshot,
        shareSessionContext.shareBookmark.participantId,
        steps,
      ),
    [shareSessionContext, steps],
  );
}
