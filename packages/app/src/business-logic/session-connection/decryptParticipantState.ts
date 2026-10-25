import type ParticipantState from "../participant-state/ParticipantState.ts";
import participantStateSchema from "../participant-state/participantStateSchema.ts";
import decryptJson from "../session-crypto/decryptJson.ts";
import sessionAdditionalData from "../session-crypto/sessionAdditionalData.ts";

export default function decryptParticipantState(
  sessionKey: CryptoKey,
  sessionId: string,
  participantId: string,
  encryptedState: string,
): Promise<ParticipantState | null> {
  return decryptJson(
    sessionKey,
    encryptedState,
    sessionAdditionalData.participantState(sessionId, participantId),
    participantStateSchema,
  );
}
