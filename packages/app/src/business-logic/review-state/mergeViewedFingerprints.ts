import type ParticipantState from "../participant-state/ParticipantState.ts";

/**
 * The fingerprints of the files viewed in a shared review: a file counts as
 * viewed when any participant viewed it.
 */
export default function mergeViewedFingerprints(
  ownViewedFingerprints: string[],
  otherParticipantStates: Iterable<ParticipantState>,
): Set<string> {
  const viewedFingerprints = new Set(ownViewedFingerprints);
  for (const participantState of otherParticipantStates) {
    for (const fingerprint of participantState.viewedFingerprints) {
      viewedFingerprints.add(fingerprint);
    }
  }
  return viewedFingerprints;
}
