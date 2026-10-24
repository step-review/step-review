import type { ReviewFileProblem } from "@step-review/review-format";
import { useState } from "react";
import navigateTo from "../navigation/navigateTo.ts";
import parseLocation from "../navigation/parseLocation.ts";
import RouteName from "../navigation/RouteName.ts";
import routeReviewAddress from "../navigation/routeReviewAddress.ts";
import saveReview from "../review-store/saveReview.ts";
import loadReview from "./loadReview.ts";

/**
 * Reads a review file and keeps it in the browser. Stays on the current page of
 * the same review (e.g. after the agent reviewed the PR again), otherwise opens
 * the review's overview.
 */
export default function useOpenReviewFile() {
  const [problems, setProblems] = useState<ReviewFileProblem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const openReviewFile = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      const result = loadReview(file.name, text);
      if (!result.success) {
        setProblems(result.problems);
        return;
      }
      setProblems([]);
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
  return { openReviewFile, problems, isLoading };
}
