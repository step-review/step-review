import { useState } from "react";
import navigateTo from "../navigation/navigateTo.ts";
import parseLocation from "../navigation/parseLocation.ts";
import RouteName from "../navigation/RouteName.ts";
import routeReviewAddress from "../navigation/routeReviewAddress.ts";
import saveReview from "../review-store/saveReview.ts";
import type InvalidReviewFile from "./InvalidReviewFile.ts";
import loadReview from "./loadReview.ts";

/**
 * Reads a review file and keeps it in the browser. Stays on the current page if
 * it's the review shown, otherwise opens the review's overview.
 */
export default function useOpenReviewFile() {
  const [invalidReviewFile, setInvalidReviewFile] =
    useState<InvalidReviewFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const openReviewFile = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      const result = loadReview(file.name, text);
      if (!result.success) {
        setInvalidReviewFile({
          fileName: file.name,
          problems: result.problems,
        });
        return;
      }
      setInvalidReviewFile(null);
      const { reviewId } = result.loadedReview;
      await saveReview(result.loadedReview);
      const currentReviewAddress = routeReviewAddress(
        parseLocation(window.location.pathname, window.location.hash).route,
      );
      if (
        currentReviewAddress?.kind !== "local" ||
        currentReviewAddress.reviewId !== reviewId
      ) {
        navigateTo({
          name: RouteName.Overview,
          reviewAddress: { kind: "local", reviewId },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { openReviewFile, invalidReviewFile, isLoading };
}
