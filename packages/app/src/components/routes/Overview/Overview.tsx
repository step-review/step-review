import { Stack } from "@primer/react";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useScrollToFragment from "../../../business-logic/navigation/useScrollToFragment.ts";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useReviewView from "../../../business-logic/review-view/useReviewView.ts";
import { useLoadedReviewContext } from "../../../business-logic/review/LoadedReviewValue.tsx";
import useOwnPresence from "../../../business-logic/share-session/useOwnPresence.ts";
import useHotkeys from "../../design-system/hooks/useHotkeys.ts";
import IssuesByStep from "../../widgets/IssuesByStep/IssuesByStep.tsx";
import OverviewHeader from "../../widgets/OverviewHeader/OverviewHeader.tsx";
import OverviewSummary from "../../widgets/OverviewSummary/OverviewSummary.tsx";
import ReviewShell from "../../widgets/ReviewShell/ReviewShell.tsx";
import ReviewWarnings from "../../widgets/ReviewWarnings/ReviewWarnings.tsx";
import Start from "../Start/Start.tsx";
import styles from "./Overview.module.css";

export default function Overview() {
  const { loadedReview, reviewAddress } = useLoadedReviewContext();
  const reviewView = useReviewView();
  useScrollToFragment();
  useOwnPresence(null, null);
  useHotkeys([
    [
      "ArrowRight",
      () => {
        const firstStep = reviewView?.steps[0];
        if (firstStep) {
          navigateTo({
            name: RouteName.Step,
            reviewAddress: reviewView.reviewAddress,
            stepId: firstStep.id,
          });
        }
      },
    ],
  ]);
  // Being read from the browser's storage, which takes a moment.
  if (loadedReview === undefined) {
    return null;
  }
  if (!loadedReview || !reviewView) {
    return <Start missingReview={reviewAddress?.kind ?? "local"} />;
  }
  return (
    <ReviewViewProvider reviewView={reviewView}>
      <ReviewShell
        loadedReview={loadedReview}
        reviewView={reviewView}
        activeStepId={null}
      >
        <Stack gap="spacious" className={styles["content"]}>
          <OverviewHeader />
          <ReviewWarnings loadedReview={loadedReview} />
          <OverviewSummary />
          <IssuesByStep />
        </Stack>
      </ReviewShell>
    </ReviewViewProvider>
  );
}
