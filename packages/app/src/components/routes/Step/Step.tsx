import { Divider, Stack } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useScrollToFragment from "../../../business-logic/navigation/useScrollToFragment.ts";
import useDiffPreferences from "../../../business-logic/preferences/useDiffPreferences.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useReviewView from "../../../business-logic/review-view/useReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import { useLoadedReviewContext } from "../../../business-logic/review/LoadedReviewProvider.tsx";
import FileCard from "../../widgets/FileCard/FileCard.tsx";
import ReviewShell from "../../widgets/ReviewShell/ReviewShell.tsx";
import StepHeader from "../../widgets/StepHeader/StepHeader.tsx";
import StepPager from "../../widgets/StepPager/StepPager.tsx";
import StepToolbar from "../../widgets/StepToolbar/StepToolbar.tsx";
import NotFound from "../NotFound/NotFound.tsx";
import Start from "../Start/Start.tsx";

interface Props {
  stepId: string;
}

export default function Step({ stepId }: Props) {
  const { loadedReview } = useLoadedReviewContext();
  const reviewView = useReviewView();
  if (!loadedReview || !reviewView) {
    return <Start isReviewMissing />;
  }
  const stepIndex = reviewView.steps.findIndex((step) => step.id === stepId);
  if (stepIndex === -1) {
    return <NotFound />;
  }
  return (
    <ReviewViewProvider reviewView={reviewView}>
      <StepPage
        loadedReview={loadedReview}
        reviewView={reviewView}
        stepIndex={stepIndex}
      />
    </ReviewViewProvider>
  );
}

interface StepPageProps {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
  stepIndex: number;
}

function StepPage({ loadedReview, reviewView, stepIndex }: StepPageProps) {
  const stepView = reviewView.steps[stepIndex]!;
  const preferences = useDiffPreferences();
  const { dispatch } = useReviewState();
  useScrollToFragment();
  const goToStep = (index: number) => {
    const step = reviewView.steps[index];
    if (step) {
      navigateTo({ name: RouteName.Step, stepId: step.id });
    } else if (index < 0) {
      navigateTo({ name: RouteName.Overview });
    }
  };
  useHotkeys([
    ["ArrowLeft", () => goToStep(stepIndex - 1)],
    ["ArrowRight", () => goToStep(stepIndex + 1)],
  ]);
  return (
    <ReviewShell
      loadedReview={loadedReview}
      reviewView={reviewView}
      activeStepId={stepView.id}
    >
      <Stack gap="lg">
        <StepHeader
          stepView={stepView}
          stepCount={reviewView.steps.length}
          areExplainersHidden={preferences.explainers === "hidden"}
        />
        <StepToolbar
          preferences={preferences}
          onMarkAllViewed={() =>
            dispatch({
              type: "setViewed",
              fingerprints: stepView.files.map((file) => file.fingerprint),
              viewed: true,
            })
          }
        />
        {stepView.files.map((file) => (
          <FileCard
            key={file.id}
            stepView={stepView}
            stepFileView={file}
            layout={preferences.layout}
            areExplainersHidden={preferences.explainers === "hidden"}
          />
        ))}
        <Divider />
        <StepPager reviewView={reviewView} stepIndex={stepIndex} />
      </Stack>
    </ReviewShell>
  );
}
