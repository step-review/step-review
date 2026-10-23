import type { ReviewFileProblem } from "@step-review/review-format";
import { useState } from "react";
import navigateTo from "../navigation/navigateTo.ts";
import parseRoute from "../navigation/parseRoute.ts";
import RouteName from "../navigation/RouteName.ts";
import { useLoadedReviewContext } from "./LoadedReviewProvider.tsx";
import loadReview from "./loadReview.ts";

/**
 * Reads and loads a review file. Stays on the current review page (e.g. after a
 * reload), otherwise opens the overview.
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
      if (route.name !== RouteName.Overview && route.name !== RouteName.Step) {
        navigateTo({ name: RouteName.Overview });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { openReviewFile, problems, isLoading };
}
