import { useEffect, useState } from "react";
import type LoadedReview from "../review/LoadedReview.ts";
import fetchSessionInfo from "./fetchSessionInfo.ts";
import fetchSessionReview from "./fetchSessionReview.ts";

/**
 * Loads a session's review: the version the connection names, or else the
 * latest one the API returns, so that the review shows before the socket joins.
 * While a new version loads, the previous one stays. `null` when the session
 * doesn't exist or can't be decrypted, `undefined` while it loads.
 */
export default function useSessionLoadedReview(
  apiOrigin: string,
  sessionId: string,
  sessionKey: CryptoKey,
  connectionVersionId: string | null,
): LoadedReview | null | undefined {
  const [fetchedVersionId, setFetchedVersionId] = useState<string | null>();
  const [loadedReview, setLoadedReview] = useState<LoadedReview | null>();
  useEffect(() => {
    let isCurrent = true;
    void fetchSessionInfo(apiOrigin, sessionId)
      .then((sessionInfo) => sessionInfo?.versionId ?? null)
      // The connection retries: its version will load once it joins.
      .catch(() => undefined)
      .then((versionId) => {
        if (isCurrent) {
          setFetchedVersionId(versionId);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [apiOrigin, sessionId]);
  const versionId = connectionVersionId ?? fetchedVersionId;
  useEffect(() => {
    if (versionId === null) {
      setLoadedReview(null);
    }
    if (!versionId) {
      return;
    }
    let isCurrent = true;
    void fetchSessionReview(apiOrigin, sessionId, sessionKey, versionId)
      .then((fetchedReview) => {
        if (isCurrent) {
          setLoadedReview(fetchedReview);
        }
      })
      .catch(() => {
        // A newer version replaced this one meanwhile: the connection names it.
      });
    return () => {
      isCurrent = false;
    };
  }, [apiOrigin, sessionId, sessionKey, versionId]);
  return loadedReview;
}
