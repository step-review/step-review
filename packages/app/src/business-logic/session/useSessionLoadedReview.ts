import { useEffect, useState } from "react";
import type LoadedReview from "../review/LoadedReview.ts";
import fetchSessionReview from "./fetchSessionReview.ts";

/** How long to wait before fetching the review again, in milliseconds. */
const retryDelay = 5000;

/**
 * Loads a session's review. `null` when the session doesn't exist or its review
 * can't be decrypted, `undefined` while it loads.
 */
export default function useSessionLoadedReview(
  apiOrigin: string,
  sessionId: string,
  sessionKey: CryptoKey,
): LoadedReview | null | undefined {
  const [loadedReview, setLoadedReview] = useState<LoadedReview | null>();
  useEffect(() => {
    let isCurrent = true;
    let retryTimeout: ReturnType<typeof setTimeout> | undefined;
    const load = () => {
      void fetchSessionReview(apiOrigin, sessionId, sessionKey)
        .then((fetchedReview) => {
          if (isCurrent) {
            setLoadedReview(fetchedReview);
          }
        })
        // E.g. offline: fetched again.
        .catch(() => {
          if (isCurrent) {
            retryTimeout = setTimeout(load, retryDelay);
          }
        });
    };
    load();
    return () => {
      isCurrent = false;
      clearTimeout(retryTimeout);
    };
  }, [apiOrigin, sessionId, sessionKey]);
  return loadedReview;
}
