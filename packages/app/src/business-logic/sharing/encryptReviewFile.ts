import encryptEnvelope from "../share-crypto/encryptEnvelope.ts";
import gzipBytes from "../share-crypto/gzipBytes.ts";
import shareAdditionalData from "../share-crypto/shareAdditionalData.ts";
import type SharedReviewFile from "./SharedReviewFile.ts";

/** Compressed first: diffs compress well, and ciphertext doesn't. */
export default async function encryptReviewFile(
  shareKey: CryptoKey,
  shareId: string,
  sharedReviewFile: SharedReviewFile,
): Promise<Uint8Array<ArrayBuffer>> {
  return encryptEnvelope(
    shareKey,
    await gzipBytes(new TextEncoder().encode(JSON.stringify(sharedReviewFile))),
    shareAdditionalData.review(shareId),
  );
}
