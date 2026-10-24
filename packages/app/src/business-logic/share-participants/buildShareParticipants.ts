import type StepView from "../review-view/StepView.ts";
import hashString from "../review/hashString.ts";
import type ShareSessionSnapshot from "../share-session/ShareSessionSnapshot.ts";
import participantColorCount from "./participantColorCount.ts";
import type ShareParticipantView from "./ShareParticipantView.ts";

/**
 * The participants of a shared review: the own one first, then those online,
 * then the others, by name.
 */
export default function buildShareParticipants(
  shareSessionSnapshot: ShareSessionSnapshot,
  ownParticipantId: string,
  steps: StepView[],
): ShareParticipantView[] {
  // Presences name steps by the hash of their ID.
  const stepIdsByHash = new Map(
    steps.map((step) => [hashString(step.id), step.id]),
  );
  const stepIdsByParticipant = new Map<string, Set<string | null>>();
  for (const {
    participantId,
    presence,
  } of shareSessionSnapshot.otherPresences.values()) {
    const stepId =
      presence.stepIdHash === null
        ? null
        : stepIdsByHash.get(presence.stepIdHash);
    // A step of another version of the review: the participant is still here.
    const stepIds = stepIdsByParticipant.get(participantId) ?? new Set();
    if (stepId !== undefined) {
      stepIds.add(stepId);
    }
    stepIdsByParticipant.set(participantId, stepIds);
  }
  const otherParticipants = [
    ...shareSessionSnapshot.otherParticipantStates.entries(),
  ].map(([participantId, participantState]): ShareParticipantView => {
    const stepIds = stepIdsByParticipant.get(participantId);
    return {
      participantId,
      name: participantState.name,
      colorIndex: colorIndex(participantId),
      isSelf: false,
      isOnline: stepIds !== undefined,
      stepIds: stepIds ? [...stepIds] : [],
      viewedFingerprints: new Set(participantState.viewedFingerprints),
    };
  });
  otherParticipants.sort(
    (first, second) =>
      Number(second.isOnline) - Number(first.isOnline) ||
      first.name.localeCompare(second.name),
  );
  const { ownState, connectionStatus } = shareSessionSnapshot;
  return [
    {
      participantId: ownParticipantId,
      name: ownState.name,
      colorIndex: colorIndex(ownParticipantId),
      isSelf: true,
      isOnline: connectionStatus === "connected",
      stepIds: [],
      viewedFingerprints: new Set(ownState.viewedFingerprints),
    },
    ...otherParticipants,
  ];
}

function colorIndex(participantId: string): number {
  return (
    Number.parseInt(hashString(participantId).slice(-6), 16) %
    participantColorCount
  );
}
