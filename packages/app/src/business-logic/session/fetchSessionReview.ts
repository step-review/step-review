import type LoadedReview from "../review/LoadedReview.ts";
import loadReview from "../review/loadReview.ts";
import decryptReviewFile from "./decryptReviewFile.ts";
import fetchEncryptedReview from "./fetchEncryptedReview.ts";
import fetchSessionExists from "./fetchSessionExists.ts";

/**
 * Fetches and decrypts a session's review. `null` when the session doesn't
 * exist, or its review can't be decrypted or isn't a valid review.
 */
export default async function fetchSessionReview(
  apiOrigin: string,
  sessionId: string,
  sessionKey: CryptoKey,
): Promise<LoadedReview | null> {
  // Checked first: the browser caches the review, even once the session ended.
  if (!(await fetchSessionExists(apiOrigin, sessionId))) {
    return null;
  }
  const sessionReviewFile = await decryptReviewFile(
    sessionKey,
    sessionId,
    await fetchEncryptedReview(apiOrigin, sessionId),
  );
  const result =
    sessionReviewFile &&
    loadReview(sessionReviewFile.fileName, sessionReviewFile.text);
  return result?.success ? result.loadedReview : null;
}
