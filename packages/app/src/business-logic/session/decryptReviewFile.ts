import * as v from "valibot";
import decryptEnvelope from "../session-crypto/decryptEnvelope.ts";
import gunzipBytes from "../session-crypto/gunzipBytes.ts";
import sessionAdditionalData from "../session-crypto/sessionAdditionalData.ts";
import type SessionReviewFile from "./SessionReviewFile.ts";
import sessionReviewFileSchema from "./sessionReviewFileSchema.ts";

/** `null` when the review can't be decrypted with the key, or is malformed. */
export default async function decryptReviewFile(
  sessionKey: CryptoKey,
  sessionId: string,
  encryptedReviewFile: Uint8Array<ArrayBuffer>,
): Promise<SessionReviewFile | null> {
  const compressedReviewFile = await decryptEnvelope(
    sessionKey,
    encryptedReviewFile,
    sessionAdditionalData.review(sessionId),
  );
  if (!compressedReviewFile) {
    return null;
  }
  try {
    const result = v.safeParse(
      sessionReviewFileSchema,
      JSON.parse(
        new TextDecoder().decode(await gunzipBytes(compressedReviewFile)),
      ),
    );
    return result.success ? result.output : null;
  } catch {
    return null;
  }
}
