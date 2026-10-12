import type { ReviewFileProblem } from "@step-review/review-format";
import { useState } from "react";
import navigateTo from "../navigation/navigateTo.ts";
import parseRoute from "../navigation/parseRoute.ts";
import RouteName from "../navigation/RouteName.ts";
import { useLoadedReviewContext } from "./LoadedReviewProvider.tsx";
import loadReview from "./loadReview.ts";

/**
 * Reads and loads a review file. Stays on the current review page (e.g. after a
 * reload), otherwise opens the latest round.
 */
export default function useOpenReviewFile() {
  const { setLoadedReview } = useLoadedReviewContext();
  const [problems, setProblems] = useState<ReviewFileProblem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const openReviewFile = async (file: File) => {
    setIsLoading(true);
    try {
      const result = loadReview(file.name, await file.text());
      if (!result.success) {
        setProblems(result.problems);
        return;
      }
      setProblems([]);
      setLoadedReview(result.loadedReview);
      const route = parseRoute(window.location.pathname);
      const roundCount = result.loadedReview.reviewFile.rounds.length;
      const isReviewRoute =
        (route.name === RouteName.Overview || route.name === RouteName.Step) &&
        route.roundNumber <= roundCount;
      if (!isReviewRoute) {
        navigateTo({ name: RouteName.Overview, roundNumber: roundCount });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { openReviewFile, problems, isLoading };
}
