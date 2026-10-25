import type Presence from "../participant-state/Presence.ts";
import hashString from "../review/hashString.ts";
import encryptJson from "../session-crypto/encryptJson.ts";
import sessionAdditionalData from "../session-crypto/sessionAdditionalData.ts";
import type PresenceLocation from "./PresenceLocation.ts";

/** Encrypts where a participant is, naming the step and file by ID hashes. */
export default function encryptPresence(
  sessionKey: CryptoKey,
  sessionId: string,
  participantId: string,
  { stepId, fileId }: PresenceLocation,
): Promise<string> {
  const presence: Presence = {
    stepIdHash: stepId === null ? null : hashString(stepId),
    fileIdHash: fileId === null ? null : hashString(fileId),
  };
  return encryptJson(
    sessionKey,
    presence,
    sessionAdditionalData.presence(sessionId, participantId),
  );
}
