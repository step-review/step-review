import { Stack } from "@primer/react";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useScrollToFragment from "../../../business-logic/navigation/useScrollToFragment.ts";
import useTopFileId from "../../../business-logic/navigation/useTopFileId.ts";
import useDiffPreferences from "../../../business-logic/preferences/useDiffPreferences.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import useReviewView from "../../../business-logic/review-view/useReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import { useLoadedReviewContext } from "../../../business-logic/review/LoadedReviewValue.tsx";
import useOwnPresence from "../../../business-logic/session-connection/useOwnPresence.ts";
import useHotkeys from "../../design-system/hooks/useHotkeys.ts";
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
  const { loadedReview, reviewAddress } = useLoadedReviewContext();
  const reviewView = useReviewView();
  // Being read from the browser's storage, which takes a moment.
  if (loadedReview === undefined) {
    return null;
  }
  if (!loadedReview || !reviewView) {
    return <Start missingReview={reviewAddress?.kind ?? "local"} />;
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
  const { reviewAddress } = reviewView;
  const preferences = useDiffPreferences();
  const { dispatch } = useReviewState();
  useScrollToFragment();
  useOwnPresence(stepView.id, useTopFileId(stepView.files));
  const goToStep = (index: number) => {
    const step = reviewView.steps[index];
    if (step) {
      navigateTo({ name: RouteName.Step, reviewAddress, stepId: step.id });
    } else if (index < 0) {
      navigateTo({ name: RouteName.Overview, reviewAddress });
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
      <Stack gap="normal">
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
        <StepPager reviewView={reviewView} stepIndex={stepIndex} />
      </Stack>
    </ReviewShell>
  );
}
