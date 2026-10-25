import { useMemo } from "react";
import { useCurrentReviewView } from "../review-view/ReviewViewProvider.tsx";
import type StepView from "../review-view/StepView.ts";
import { useSessionConnectionContext } from "../session-connection/SessionConnectionProvider.tsx";
import type SessionConnectionSnapshot from "../session-connection/SessionConnectionSnapshot.ts";
import buildSessionParticipants from "./buildSessionParticipants.ts";
import type SessionParticipantView from "./SessionParticipantView.ts";

/**
 * The participants built for each snapshot, so that the many components showing
 * them (e.g. two in every file card) build them once per change.
 */
const builtSessionParticipants = new WeakMap<
  SessionConnectionSnapshot,
  {
    ownParticipantId: string;
    steps: StepView[];
    sessionParticipants: SessionParticipantView[];
  }
>();

/** The participants of the session displayed; `null` for local ones. */
export default function useSessionParticipants():
  | SessionParticipantView[]
  | null {
  const sessionConnectionContext = useSessionConnectionContext();
  const { steps } = useCurrentReviewView();
  return useMemo(() => {
    if (!sessionConnectionContext) {
      return null;
    }
    const { sessionConnectionSnapshot, sessionBookmark } =
      sessionConnectionContext;
    const { participantId } = sessionBookmark;
    const built = builtSessionParticipants.get(sessionConnectionSnapshot);
    if (built?.ownParticipantId === participantId && built.steps === steps) {
      return built.sessionParticipants;
    }
    const sessionParticipants = buildSessionParticipants(
      sessionConnectionSnapshot,
      participantId,
      steps,
    );
    builtSessionParticipants.set(sessionConnectionSnapshot, {
      ownParticipantId: participantId,
      steps,
      sessionParticipants,
    });
    return sessionParticipants;
  }, [sessionConnectionContext, steps]);
}
