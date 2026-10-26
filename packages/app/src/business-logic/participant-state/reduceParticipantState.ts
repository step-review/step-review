import participantNameMaxLength from "./participantNameMaxLength.ts";
import type ParticipantState from "./ParticipantState.ts";
import type ParticipantStateAction from "./ParticipantStateAction.ts";

export default function reduceParticipantState(
  participantState: ParticipantState,
  action: ParticipantStateAction,
): ParticipantState {
  switch (action.type) {
    case "rename":
      return {
        ...participantState,
        name: action.name.trim().slice(0, participantNameMaxLength),
      };
    case "addViewedMarks": {
      const viewedMarksByFingerprint = new Map(
        participantState.viewedMarks.map((viewedMark) => [
          viewedMark.fingerprint,
          viewedMark,
        ]),
      );
      // A mark made meanwhile in another tab may be later than this one.
      for (const viewedMark of action.viewedMarks) {
        const currentViewedMark = viewedMarksByFingerprint.get(
          viewedMark.fingerprint,
        );
        if (!currentViewedMark || viewedMark.at >= currentViewedMark.at) {
          viewedMarksByFingerprint.set(viewedMark.fingerprint, viewedMark);
        }
      }
      return {
        ...participantState,
        viewedMarks: [...viewedMarksByFingerprint.values()],
      };
    }
  }
}
