import type LoadedReview from "../review/LoadedReview.ts";
import importSessionKey from "../session-crypto/importSessionKey.ts";
import fetchSessionReview from "./fetchSessionReview.ts";

/**
 * Loads the review a link opens, before joining it. `null` when it can't be
 * opened: deleted, expired, or a link cut short.
 */
export default async function loadLinkedReview(
  apiOrigin: string,
  sessionId: string,
  sessionKey: string,
): Promise<LoadedReview | null> {
  const cryptoKey = await importSessionKey(sessionKey);
  return cryptoKey && fetchSessionReview(apiOrigin, sessionId, cryptoKey);
}
