import * as v from "valibot";
import decryptEnvelope from "../share-crypto/decryptEnvelope.ts";
import gunzipBytes from "../share-crypto/gunzipBytes.ts";
import shareAdditionalData from "../share-crypto/shareAdditionalData.ts";
import type SharedReviewFile from "./SharedReviewFile.ts";
import sharedReviewFileSchema from "./sharedReviewFileSchema.ts";

/** `null` when the review can't be decrypted with the key, or is malformed. */
export default async function decryptReviewFile(
  shareKey: CryptoKey,
  shareId: string,
  encryptedReviewFile: Uint8Array<ArrayBuffer>,
): Promise<SharedReviewFile | null> {
  const compressedReviewFile = await decryptEnvelope(
    shareKey,
    encryptedReviewFile,
    shareAdditionalData.review(shareId),
  );
  if (!compressedReviewFile) {
    return null;
  }
  try {
    const result = v.safeParse(
      sharedReviewFileSchema,
      JSON.parse(
        new TextDecoder().decode(await gunzipBytes(compressedReviewFile)),
      ),
    );
    return result.success ? result.output : null;
  } catch {
    return null;
  }
}
