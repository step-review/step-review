import type ParticipantState from "./ParticipantState.ts";
import type ParticipantStateAction from "./ParticipantStateAction.ts";

/**
 * The participant's own state, as stored by the server and as changed since.
 * The server only stores a write based on its latest revision, so changes made
 * meanwhile (e.g. in another tab) are never overwritten: the pending actions
 * are applied again to the newer state.
 */
export default interface OwnStateSync {
  /** The revision of the stored state; 0 before the first write. */
  revision: number;
  storedState: ParticipantState | null;
  /** The actions not stored yet, oldest first. */
  pendingActions: ParticipantStateAction[];
  /** The write sent and not answered yet, if any. */
  inFlightWrite: {
    /** How many of the pending actions it includes. */
    actionCount: number;
    participantState: ParticipantState;
  } | null;
}
