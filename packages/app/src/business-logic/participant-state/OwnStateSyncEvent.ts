import type ParticipantState from "./ParticipantState.ts";
import type ParticipantStateAction from "./ParticipantStateAction.ts";

type OwnStateSyncEvent =
  | { type: "actionDispatched"; action: ParticipantStateAction }
  | { type: "writeSent"; participantState: ParticipantState }
  | { type: "writeStored"; revision: number }
  | {
      type: "writeRejected";
      revision: number;
      storedState: ParticipantState | null;
    }
  /** The stored state, on joining or written by another connection. */
  | {
      type: "stateReceived";
      revision: number;
      storedState: ParticipantState | null;
    }
  /** The write in flight, if any, may or may not have been stored. */
  | { type: "disconnected" };

export default OwnStateSyncEvent;
