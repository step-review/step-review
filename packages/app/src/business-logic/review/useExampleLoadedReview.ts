import { useEffect, useState } from "react";
import exampleReviewId from "./exampleReviewId.ts";
import exampleReviewPath from "./exampleReviewPath.ts";
import type LoadedReview from "./LoadedReview.ts";
import loadReview from "./loadReview.ts";

/**
 * Loads the example review served with the app. `null` when it can't be loaded,
 * `undefined` while it is fetched.
 */
export default function useExampleLoadedReview():
  | LoadedReview
  | null
  | undefined {
  const [loadedReview, setLoadedReview] = useState<LoadedReview | null>();
  useEffect(() => {
    void (async () => {
      const response = await fetch(exampleReviewPath);
      const result = loadReview(
        exampleReviewPath.split("/").at(-1)!,
        await response.text(),
      );
      setLoadedReview(
        result.success
          ? { ...result.loadedReview, reviewId: exampleReviewId }
          : null,
      );
    })();
  }, []);
  return loadedReview;
}
