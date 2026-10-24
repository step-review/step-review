import type LoadedReview from "../review/LoadedReview.ts";
import importShareKey from "../share-crypto/importShareKey.ts";
import fetchSharedReview from "./fetchSharedReview.ts";
import fetchShareInfo from "./fetchShareInfo.ts";

/**
 * Loads the review a link opens, before joining it. `null` when it can't be
 * opened: deleted, expired, or a link cut short.
 */
export default async function loadLinkedReview(
  apiOrigin: string,
  shareId: string,
  shareKey: string,
): Promise<LoadedReview | null> {
  const cryptoKey = await importShareKey(shareKey);
  const shareInfo = cryptoKey && (await fetchShareInfo(apiOrigin, shareId));
  return cryptoKey && shareInfo
    ? fetchSharedReview(apiOrigin, shareId, cryptoKey, shareInfo.versionId)
    : null;
}
