import type Presence from "../participant-state/Presence.ts";
import type StepView from "../review-view/StepView.ts";
import hashString from "../review/hashString.ts";
import type PresenceLocation from "../session-connection/PresenceLocation.ts";
import type SessionConnectionSnapshot from "../session-connection/SessionConnectionSnapshot.ts";
import participantColorCount from "./participantColorCount.ts";
import type SessionParticipantView from "./SessionParticipantView.ts";

/**
 * The participants of a session: the own one first, then those online, then the
 * others, by name.
 */
export default function buildSessionParticipants(
  sessionConnectionSnapshot: SessionConnectionSnapshot,
  ownParticipantId: string,
  steps: StepView[],
): SessionParticipantView[] {
  const locationsByParticipant = new Map<
    string,
    Map<string, PresenceLocation>
  >();
  const resolvePresence = createPresenceResolver(steps);
  for (const {
    participantId,
    presence,
  } of sessionConnectionSnapshot.otherPresences.values()) {
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
  const viewedFingerprintsByParticipant = new Map<string, Set<string>>();
  for (const [
    fingerprint,
    { viewerIds },
  ] of sessionConnectionSnapshot.fileViewedStatuses) {
    for (const viewerId of viewerIds) {
      const viewedFingerprints =
        viewedFingerprintsByParticipant.get(viewerId) ?? new Set<string>();
      viewedFingerprints.add(fingerprint);
      viewedFingerprintsByParticipant.set(viewerId, viewedFingerprints);
    }
  }
  const otherParticipants = [
    ...sessionConnectionSnapshot.otherParticipantStates.entries(),
  ].map(([participantId, participantState]): SessionParticipantView => {
    const locations = locationsByParticipant.get(participantId);
    return {
      participantId,
      name: participantState.name,
      colorIndex: colorIndex(participantId),
      isSelf: false,
      isOnline: locations !== undefined,
      locations: locations ? [...locations.values()] : [],
      viewedFingerprints:
        viewedFingerprintsByParticipant.get(participantId) ?? new Set(),
    };
  });
  otherParticipants.sort(
    (first, second) =>
      Number(second.isOnline) - Number(first.isOnline) ||
      first.name.localeCompare(second.name),
  );
  const { ownState, connectionStatus } = sessionConnectionSnapshot;
  return [
    {
      participantId: ownParticipantId,
      name: ownState.name,
      colorIndex: colorIndex(ownParticipantId),
      isSelf: true,
      isOnline: connectionStatus === "connected",
      locations: [],
      viewedFingerprints:
        viewedFingerprintsByParticipant.get(ownParticipantId) ?? new Set(),
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
