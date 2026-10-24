import type { ServerMessage } from "@step-review/share-server";
import type ParticipantState from "../participant-state/ParticipantState.ts";
import decryptParticipantState from "./decryptParticipantState.ts";
import decryptPresence from "./decryptPresence.ts";
import type ShareSessionOptions from "./ShareSessionOptions.ts";
import type ShareSessionSnapshot from "./ShareSessionSnapshot.ts";

/**
 * The states and presences a joining connection gets. Those that can't be
 * decrypted are left out: other participants wrote them.
 */
export default async function decryptJoinedMessage(
  { shareKey, shareId, participantId }: ShareSessionOptions,
  joinedMessage: Extract<ServerMessage, { type: "joined" }>,
): Promise<{
  ownRevision: number;
  ownStoredState: ParticipantState | null;
  otherParticipantStates: ShareSessionSnapshot["otherParticipantStates"];
  otherPresences: ShareSessionSnapshot["otherPresences"];
}> {
  let ownRevision = 0;
  let ownStoredState: ParticipantState | null = null;
  const otherParticipantStates = new Map<string, ParticipantState>();
  for (const entry of joinedMessage.participantStates) {
    const participantState = await decryptParticipantState(
      shareKey,
      shareId,
      entry.participantId,
      entry.state,
    );
    if (entry.participantId === participantId) {
      ownRevision = entry.revision;
      ownStoredState = participantState;
    } else if (participantState) {
      otherParticipantStates.set(entry.participantId, participantState);
    }
  }
  const otherPresences: ShareSessionSnapshot["otherPresences"] = new Map();
  for (const entry of joinedMessage.presences) {
    const presence = await decryptPresence(
      shareKey,
      shareId,
      entry.participantId,
      entry.presence,
    );
    if (presence) {
      otherPresences.set(entry.connectionId, {
        participantId: entry.participantId,
        presence,
      });
    }
  }
  return {
    ownRevision,
    ownStoredState,
    otherParticipantStates,
    otherPresences,
  };
}
