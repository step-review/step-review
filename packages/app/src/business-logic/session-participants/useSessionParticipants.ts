import { useMemo } from "react";
import { useCurrentReviewView } from "../review-view/ReviewViewProvider.tsx";
import { useSessionConnectionContext } from "../session-connection/SessionConnectionProvider.tsx";
import buildSessionParticipants from "./buildSessionParticipants.ts";
import type SessionParticipantView from "./SessionParticipantView.ts";

/** The participants of the session displayed; `null` for local ones. */
export default function useSessionParticipants():
  | SessionParticipantView[]
  | null {
  const sessionConnectionContext = useSessionConnectionContext();
  const { steps } = useCurrentReviewView();
  return useMemo(
    () =>
      sessionConnectionContext &&
      buildSessionParticipants(
        sessionConnectionContext.sessionConnectionSnapshot,
        sessionConnectionContext.sessionBookmark.participantId,
        steps,
      ),
    [sessionConnectionContext, steps],
  );
}
