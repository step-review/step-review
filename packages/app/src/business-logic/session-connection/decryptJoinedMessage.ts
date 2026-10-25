import type { ServerMessage } from "@step-review/session-server";
import type ParticipantState from "../participant-state/ParticipantState.ts";
import decryptParticipantState from "./decryptParticipantState.ts";
import decryptPresence from "./decryptPresence.ts";
import type SessionConnectionOptions from "./SessionConnectionOptions.ts";
import type SessionConnectionSnapshot from "./SessionConnectionSnapshot.ts";

/**
 * The states and presences a joining connection gets. Those that can't be
 * decrypted are left out: other participants wrote them.
 */
export default async function decryptJoinedMessage(
  { sessionKey, sessionId, participantId }: SessionConnectionOptions,
  joinedMessage: Extract<ServerMessage, { type: "joined" }>,
): Promise<{
  ownRevision: number;
  ownStoredState: ParticipantState | null;
  otherParticipantStates: SessionConnectionSnapshot["otherParticipantStates"];
  otherPresences: SessionConnectionSnapshot["otherPresences"];
}> {
  let ownRevision = 0;
  let ownStoredState: ParticipantState | null = null;
  const otherParticipantStates = new Map<string, ParticipantState>();
  for (const entry of joinedMessage.participantStates) {
    const participantState = await decryptParticipantState(
      sessionKey,
      sessionId,
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
  const otherPresences: SessionConnectionSnapshot["otherPresences"] = new Map();
  for (const entry of joinedMessage.presences) {
    const presence = await decryptPresence(
      sessionKey,
      sessionId,
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
