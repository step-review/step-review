import type LoadedReview from "../review/LoadedReview.ts";
import loadReview from "../review/loadReview.ts";
import decryptReviewFile from "./decryptReviewFile.ts";
import fetchReviewVersion from "./fetchReviewVersion.ts";

/**
 * Fetches and decrypts a version of a shared review. `null` when it can't be
 * decrypted or isn't a valid review.
 */
export default async function fetchSharedReview(
  apiOrigin: string,
  shareId: string,
  shareKey: CryptoKey,
  versionId: string,
): Promise<LoadedReview | null> {
  const sharedReviewFile = await decryptReviewFile(
    shareKey,
    shareId,
    await fetchReviewVersion(apiOrigin, shareId, versionId),
  );
  const result =
    sharedReviewFile &&
    loadReview(sharedReviewFile.fileName, sharedReviewFile.text);
  return result?.success ? result.loadedReview : null;
}
