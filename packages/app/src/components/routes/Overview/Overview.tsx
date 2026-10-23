import { Stack } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useScrollToFragment from "../../../business-logic/navigation/useScrollToFragment.ts";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useReviewView from "../../../business-logic/review-view/useReviewView.ts";
import { useLoadedReviewContext } from "../../../business-logic/review/LoadedReviewProvider.tsx";
import IssuesIndex from "../../widgets/IssuesIndex/IssuesIndex.tsx";
import OverviewHeader from "../../widgets/OverviewHeader/OverviewHeader.tsx";
import OverviewSummary from "../../widgets/OverviewSummary/OverviewSummary.tsx";
import ReviewShell from "../../widgets/ReviewShell/ReviewShell.tsx";
import ReviewWarnings from "../../widgets/ReviewWarnings/ReviewWarnings.tsx";
import Start from "../Start/Start.tsx";

export default function Overview() {
  const { loadedReview } = useLoadedReviewContext();
  const reviewView = useReviewView();
  useScrollToFragment();
  useHotkeys([
    [
      "ArrowRight",
      () => {
        const firstStep = reviewView?.steps[0];
        if (firstStep) {
          navigateTo({ name: RouteName.Step, stepId: firstStep.id });
        }
      },
    ],
  ]);
  if (!loadedReview || !reviewView) {
    return <Start isReviewMissing />;
  }
  return (
    <ReviewViewProvider reviewView={reviewView}>
      <ReviewShell
        loadedReview={loadedReview}
        reviewView={reviewView}
        activeStepId={null}
      >
        <Stack gap="xl" maw={1100}>
          <OverviewHeader />
          <ReviewWarnings loadedReview={loadedReview} />
          <OverviewSummary />
          <IssuesIndex />
        </Stack>
      </ReviewShell>
    </ReviewViewProvider>
  );
}
