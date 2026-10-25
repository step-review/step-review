import encryptEnvelope from "../session-crypto/encryptEnvelope.ts";
import gzipBytes from "../session-crypto/gzipBytes.ts";
import sessionAdditionalData from "../session-crypto/sessionAdditionalData.ts";
import type SessionReviewFile from "./SessionReviewFile.ts";

/** Compressed first: diffs compress well, and ciphertext doesn't. */
export default async function encryptReviewFile(
  sessionKey: CryptoKey,
  sessionId: string,
  sessionReviewFile: SessionReviewFile,
): Promise<Uint8Array<ArrayBuffer>> {
  return encryptEnvelope(
    sessionKey,
    await gzipBytes(
      new TextEncoder().encode(JSON.stringify(sessionReviewFile)),
    ),
    sessionAdditionalData.review(sessionId),
  );
}
