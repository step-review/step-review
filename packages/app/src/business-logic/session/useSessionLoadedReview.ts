import { useEffect, useState } from "react";
import type LoadedReview from "../review/LoadedReview.ts";
import fetchSessionInfo from "./fetchSessionInfo.ts";
import fetchSessionReview from "./fetchSessionReview.ts";
import SessionApiError from "./SessionApiError.ts";

/** How long to wait before fetching a version again, in milliseconds. */
const retryDelay = 5000;

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
    let retryTimeout: ReturnType<typeof setTimeout> | undefined;
    const load = () => {
      void fetchSessionReview(apiOrigin, sessionId, sessionKey, versionId)
        .then((fetchedReview) => {
          if (isCurrent) {
            setLoadedReview(fetchedReview);
          }
        })
        .catch((error: unknown) => {
          // Not found: a newer version replaced this one meanwhile, and the
          // connection names it. Otherwise, e.g. offline, the same version
          // is fetched again.
          if (
            isCurrent &&
            !(error instanceof SessionApiError && error.status === 404)
          ) {
            retryTimeout = setTimeout(load, retryDelay);
          }
        });
    };
    load();
    return () => {
      isCurrent = false;
      clearTimeout(retryTimeout);
    };
  }, [apiOrigin, sessionId, sessionKey, versionId]);
  return loadedReview;
}
