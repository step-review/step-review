import emptyParticipantState from "./emptyParticipantState.ts";
import type OwnStateSync from "./OwnStateSync.ts";
import type ParticipantState from "./ParticipantState.ts";
import type ParticipantStateAction from "./ParticipantStateAction.ts";
import reduceParticipantState from "./reduceParticipantState.ts";

/**
 * The own states computed, by their pending actions, so that the same stored
 * state and actions give the same object: e.g. sending a write leaves the own
 * state, and the statuses merged from it, unchanged.
 */
const ownStates = new WeakMap<
  ParticipantStateAction[],
  { storedState: ParticipantState | null; ownState: ParticipantState }
>();

/** The own state with every change applied, stored or not. */
export default function currentOwnState(
  ownStateSync: OwnStateSync,
): ParticipantState {
  const { storedState, pendingActions } = ownStateSync;
  const computedOwnState = ownStates.get(pendingActions);
  if (computedOwnState?.storedState === storedState) {
    return computedOwnState.ownState;
  }
  const ownState = pendingActions.reduce(
    reduceParticipantState,
    storedState ?? emptyParticipantState(),
  );
  ownStates.set(pendingActions, { storedState, ownState });
  return ownState;
}
