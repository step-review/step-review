import type ParticipantState from "../participant-state/ParticipantState.ts";
import participantStateSchema from "../participant-state/participantStateSchema.ts";
import decryptJson from "../share-crypto/decryptJson.ts";
import shareAdditionalData from "../share-crypto/shareAdditionalData.ts";

export default function decryptParticipantState(
  shareKey: CryptoKey,
  shareId: string,
  participantId: string,
  encryptedState: string,
): Promise<ParticipantState | null> {
  return decryptJson(
    shareKey,
    encryptedState,
    shareAdditionalData.participantState(shareId, participantId),
    participantStateSchema,
  );
}
