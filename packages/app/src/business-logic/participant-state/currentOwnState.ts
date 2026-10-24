import emptyParticipantState from "./emptyParticipantState.ts";
import type OwnStateSync from "./OwnStateSync.ts";
import type ParticipantState from "./ParticipantState.ts";
import reduceParticipantState from "./reduceParticipantState.ts";

/** The own state with every change applied, stored or not. */
export default function currentOwnState(
  ownStateSync: OwnStateSync,
): ParticipantState {
  return ownStateSync.pendingActions.reduce(
    reduceParticipantState,
    ownStateSync.storedState ?? emptyParticipantState(),
  );
}
