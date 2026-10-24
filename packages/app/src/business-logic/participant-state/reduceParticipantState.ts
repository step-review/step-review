import reduceReviewState from "../review-state/reduceReviewState.ts";
import participantNameMaxLength from "./participantNameMaxLength.ts";
import type ParticipantState from "./ParticipantState.ts";
import type ParticipantStateAction from "./ParticipantStateAction.ts";

export default function reduceParticipantState(
  participantState: ParticipantState,
  action: ParticipantStateAction,
): ParticipantState {
  if (action.type === "rename") {
    return {
      ...participantState,
      name: action.name.trim().slice(0, participantNameMaxLength),
    };
  }
  // A replaced review state (e.g. imported) keeps the name.
  return {
    ...reduceReviewState(participantState, action),
    name: participantState.name,
  };
}
