import currentOwnState from "./currentOwnState.ts";
import type OwnStateSync from "./OwnStateSync.ts";
import type ParticipantState from "./ParticipantState.ts";

/**
 * The write to send, if there are changes and no write is in flight: one at a
 * time, so that each is based on the latest stored revision.
 */
export default function nextOwnStateWrite(
  ownStateSync: OwnStateSync,
): { revision: number; participantState: ParticipantState } | null {
  return ownStateSync.inFlightWrite === null &&
    ownStateSync.pendingActions.length > 0
    ? {
        revision: ownStateSync.revision,
        participantState: currentOwnState(ownStateSync),
      }
    : null;
}
