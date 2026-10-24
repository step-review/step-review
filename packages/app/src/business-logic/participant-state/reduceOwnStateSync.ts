import type OwnStateSync from "./OwnStateSync.ts";
import type OwnStateSyncEvent from "./OwnStateSyncEvent.ts";

export default function reduceOwnStateSync(
  ownStateSync: OwnStateSync,
  event: OwnStateSyncEvent,
): OwnStateSync {
  switch (event.type) {
    case "actionDispatched":
      return {
        ...ownStateSync,
        pendingActions: [...ownStateSync.pendingActions, event.action],
      };
    case "writeSent":
      return {
        ...ownStateSync,
        inFlightWrite: {
          actionCount: ownStateSync.pendingActions.length,
          participantState: event.participantState,
        },
      };
    case "writeStored": {
      const { inFlightWrite } = ownStateSync;
      if (!inFlightWrite) {
        return ownStateSync;
      }
      return {
        revision: event.revision,
        storedState: inFlightWrite.participantState,
        pendingActions: ownStateSync.pendingActions.slice(
          inFlightWrite.actionCount,
        ),
        inFlightWrite: null,
      };
    }
    case "writeRejected":
      return {
        ...ownStateSync,
        revision: event.revision,
        storedState: event.storedState,
        inFlightWrite: null,
      };
    case "stateReceived":
      // A write in flight is now based on an old revision: it will be
      // rejected, and its actions applied to this state.
      return event.revision > ownStateSync.revision
        ? {
            ...ownStateSync,
            revision: event.revision,
            storedState: event.storedState,
          }
        : ownStateSync;
    case "disconnected":
      // Sending the actions again is harmless: they set values, so applying
      // one twice gives the same state.
      return { ...ownStateSync, inFlightWrite: null };
  }
}
