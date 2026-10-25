import { useEffect } from "react";
import { useSessionConnectionContext } from "./SessionConnectionProvider.tsx";

/**
 * Tells the other participants of the session displayed, if any, where the own
 * participant is: the step, `null` on the overview, and the file in view,
 * `null` when there is none.
 */
export default function useOwnPresence(
  stepId: string | null,
  fileId: string | null,
): void {
  const sessionConnection = useSessionConnectionContext()?.sessionConnection;
  useEffect(() => {
    sessionConnection?.setPresence({ stepId, fileId });
  }, [sessionConnection, stepId, fileId]);
}
