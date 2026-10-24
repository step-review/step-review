import { useEffect, useState } from "react";
import type LoadedReview from "../review/LoadedReview.ts";
import loadReview from "../review/loadReview.ts";
import decryptReviewFile from "./decryptReviewFile.ts";
import fetchReviewVersion from "./fetchReviewVersion.ts";
import fetchShareInfo from "./fetchShareInfo.ts";

/**
 * Loads a shared review: the version the session names, or else the latest one
 * the API returns, so that the review shows before the socket joins. While a
 * new version loads, the previous one stays. `null` when the share doesn't
 * exist or can't be decrypted, `undefined` while it loads.
 */
export default function useSharedLoadedReview(
  apiOrigin: string,
  shareId: string,
  shareKey: CryptoKey,
  sessionVersionId: string | null,
): LoadedReview | null | undefined {
  const [fetchedVersionId, setFetchedVersionId] = useState<string | null>();
  const [loadedReview, setLoadedReview] = useState<LoadedReview | null>();
  useEffect(() => {
    let isCurrent = true;
    void fetchShareInfo(apiOrigin, shareId)
      .then((shareInfo) => shareInfo?.versionId ?? null)
      // The session retries: its version will load once it joins.
      .catch(() => undefined)
      .then((versionId) => {
        if (isCurrent) {
          setFetchedVersionId(versionId);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [apiOrigin, shareId]);
  const versionId = sessionVersionId ?? fetchedVersionId;
  useEffect(() => {
    if (versionId === null) {
      setLoadedReview(null);
    }
    if (!versionId) {
      return;
    }
    let isCurrent = true;
    void (async () => {
      const sharedReviewFile = await decryptReviewFile(
        shareKey,
        shareId,
        await fetchReviewVersion(apiOrigin, shareId, versionId),
      );
      const result =
        sharedReviewFile &&
        loadReview(sharedReviewFile.fileName, sharedReviewFile.text);
      if (isCurrent) {
        setLoadedReview(result?.success ? result.loadedReview : null);
      }
    })().catch(() => {
      // A newer version replaced this one meanwhile: the session names it.
    });
    return () => {
      isCurrent = false;
    };
  }, [apiOrigin, shareId, shareKey, versionId]);
  return loadedReview;
}
