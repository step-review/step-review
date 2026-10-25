import type LoadedReview from "../review/LoadedReview.ts";
import loadReview from "../review/loadReview.ts";
import decryptReviewFile from "./decryptReviewFile.ts";
import fetchReviewVersion from "./fetchReviewVersion.ts";

/**
 * Fetches and decrypts a version of a session's review. `null` when it can't be
 * decrypted or isn't a valid review.
 */
export default async function fetchSessionReview(
  apiOrigin: string,
  sessionId: string,
  sessionKey: CryptoKey,
  versionId: string,
): Promise<LoadedReview | null> {
  const sessionReviewFile = await decryptReviewFile(
    sessionKey,
    sessionId,
    await fetchReviewVersion(apiOrigin, sessionId, versionId),
  );
  const result =
    sessionReviewFile &&
    loadReview(sessionReviewFile.fileName, sessionReviewFile.text);
  return result?.success ? result.loadedReview : null;
}
