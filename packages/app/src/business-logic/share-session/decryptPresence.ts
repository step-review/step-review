import type Presence from "../participant-state/Presence.ts";
import presenceSchema from "../participant-state/presenceSchema.ts";
import decryptJson from "../share-crypto/decryptJson.ts";
import shareAdditionalData from "../share-crypto/shareAdditionalData.ts";

export default function decryptPresence(
  shareKey: CryptoKey,
  shareId: string,
  participantId: string,
  encryptedPresence: string,
): Promise<Presence | null> {
  return decryptJson(
    shareKey,
    encryptedPresence,
    shareAdditionalData.presence(shareId, participantId),
    presenceSchema,
  );
}
