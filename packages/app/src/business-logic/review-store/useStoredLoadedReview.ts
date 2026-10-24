import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import type LoadedReview from "../review/LoadedReview.ts";
import loadReview from "../review/loadReview.ts";
import reviewDatabase from "./reviewDatabase.ts";

/**
 * Loads a review kept in the browser. `null` when it isn't stored (or no longer
 * valid), `undefined` while it is read.
 */
export default function useStoredLoadedReview(
  reviewId: string,
): LoadedReview | null | undefined {
  const storedFile = useLiveQuery(async () => {
    const [storedReview, text] = await Promise.all([
      reviewDatabase.reviews.get(reviewId),
      reviewDatabase.reviewFiles.get(reviewId),
    ]);
    return storedReview && text !== undefined
      ? { fileName: storedReview.fileName, text }
      : null;
  }, [reviewId]);
  // Parsed again on every load: the file is untrusted input, and the checks
  // may have changed since it was stored.
  return useMemo(() => {
    if (!storedFile) {
      return storedFile;
    }
    const result = loadReview(storedFile.fileName, storedFile.text);
    return result.success ? result.loadedReview : null;
  }, [storedFile]);
}
