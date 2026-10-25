import type LoadedReview from "../review/LoadedReview.ts";
import importSessionKey from "../session-crypto/importSessionKey.ts";
import fetchSessionInfo from "./fetchSessionInfo.ts";
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
  const sessionInfo =
    cryptoKey && (await fetchSessionInfo(apiOrigin, sessionId));
  return cryptoKey && sessionInfo
    ? fetchSessionReview(apiOrigin, sessionId, cryptoKey, sessionInfo.versionId)
    : null;
}
