import { useEffect } from "react";
import { useShareSessionContext } from "./ShareSessionProvider.tsx";

/**
 * Tells the other participants of the shared review displayed, if any, where
 * the own participant is: the step, `null` on the overview, and the file in
 * view, `null` when there is none.
 */
export default function useOwnPresence(
  stepId: string | null,
  fileId: string | null,
): void {
  const shareSession = useShareSessionContext()?.shareSession;
  useEffect(() => {
    shareSession?.setPresence({ stepId, fileId });
  }, [shareSession, stepId, fileId]);
}
