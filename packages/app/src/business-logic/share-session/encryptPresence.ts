import type Presence from "../participant-state/Presence.ts";
import hashString from "../review/hashString.ts";
import encryptJson from "../share-crypto/encryptJson.ts";
import shareAdditionalData from "../share-crypto/shareAdditionalData.ts";
import type PresenceLocation from "./PresenceLocation.ts";

/** Encrypts where a participant is, naming the step and file by ID hashes. */
export default function encryptPresence(
  shareKey: CryptoKey,
  shareId: string,
  participantId: string,
  { stepId, fileId }: PresenceLocation,
): Promise<string> {
  const presence: Presence = {
    stepIdHash: stepId === null ? null : hashString(stepId),
    fileIdHash: fileId === null ? null : hashString(fileId),
  };
  return encryptJson(
    shareKey,
    presence,
    shareAdditionalData.presence(shareId, participantId),
  );
}
