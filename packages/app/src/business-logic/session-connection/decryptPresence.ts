import type Presence from "../participant-state/Presence.ts";
import presenceSchema from "../participant-state/presenceSchema.ts";
import decryptJson from "../session-crypto/decryptJson.ts";
import sessionAdditionalData from "../session-crypto/sessionAdditionalData.ts";

export default function decryptPresence(
  sessionKey: CryptoKey,
  sessionId: string,
  participantId: string,
  encryptedPresence: string,
): Promise<Presence | null> {
  return decryptJson(
    sessionKey,
    encryptedPresence,
    sessionAdditionalData.presence(sessionId, participantId),
    presenceSchema,
  );
}
