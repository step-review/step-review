import type Presence from "../participant-state/Presence.ts";
import type StepView from "../review-view/StepView.ts";
import hashString from "../review/hashString.ts";
import type PresenceLocation from "../share-session/PresenceLocation.ts";
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
  const locationsByParticipant = new Map<
    string,
    Map<string, PresenceLocation>
  >();
  const resolvePresence = createPresenceResolver(steps);
  for (const {
    participantId,
    presence,
  } of shareSessionSnapshot.otherPresences.values()) {
    const locations =
      locationsByParticipant.get(participantId) ??
      new Map<string, PresenceLocation>();
    // A step of another version of the review: the participant is still here.
    const location = resolvePresence(presence);
    if (location) {
      // The same place in two tabs is shown once.
      locations.set(
        JSON.stringify([location.stepId, location.fileId]),
        location,
      );
    }
    locationsByParticipant.set(participantId, locations);
  }
  const otherParticipants = [
    ...shareSessionSnapshot.otherParticipantStates.entries(),
  ].map(([participantId, participantState]): ShareParticipantView => {
    const locations = locationsByParticipant.get(participantId);
    return {
      participantId,
      name: participantState.name,
      colorIndex: colorIndex(participantId),
      isSelf: false,
      isOnline: locations !== undefined,
      locations: locations ? [...locations.values()] : [],
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
      locations: [],
      viewedFingerprints: new Set(ownState.viewedFingerprints),
    },
    ...otherParticipants,
  ];
}

/**
 * Finds the step and file a presence names by the hashes of their IDs:
 * `undefined` for a step that isn't in the review.
 */
function createPresenceResolver(
  steps: StepView[],
): (presence: Presence) => PresenceLocation | undefined {
  const stepIdsByHash = new Map(
    steps.map((step) => [hashString(step.id), step.id]),
  );
  const fileLocationsByHash = new Map(
    steps.flatMap((step) =>
      step.files.map((file) => [
        hashString(file.id),
        { stepId: step.id, fileId: file.id },
      ]),
    ),
  );
  return ({ stepIdHash, fileIdHash }) => {
    const stepId = stepIdHash === null ? null : stepIdsByHash.get(stepIdHash);
    if (stepId === undefined) {
      return undefined;
    }
    const fileLocation =
      fileIdHash === null ? undefined : fileLocationsByHash.get(fileIdHash);
    // Other participants write presences: a file of another step than theirs
    // can't be where they are.
    const fileId = fileLocation?.stepId === stepId ? fileLocation.fileId : null;
    return { stepId, fileId };
  };
}

function colorIndex(participantId: string): number {
  return (
    Number.parseInt(hashString(participantId).slice(-6), 16) %
    participantColorCount
  );
}
