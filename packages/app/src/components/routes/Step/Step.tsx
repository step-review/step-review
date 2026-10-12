import { Divider, Stack } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useScrollToFragment from "../../../business-logic/navigation/useScrollToFragment.ts";
import useDiffPreferences from "../../../business-logic/preferences/useDiffPreferences.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import { useLoadedReviewContext } from "../../../business-logic/review/LoadedReviewProvider.tsx";
import type RoundView from "../../../business-logic/rounds/RoundView.ts";
import RoundViewProvider from "../../../business-logic/rounds/RoundViewProvider.tsx";
import useRoundView from "../../../business-logic/rounds/useRoundView.ts";
import FileCard from "../../widgets/FileCard/FileCard.tsx";
import ReviewShell from "../../widgets/ReviewShell/ReviewShell.tsx";
import StepHeader from "../../widgets/StepHeader/StepHeader.tsx";
import StepPager from "../../widgets/StepPager/StepPager.tsx";
import StepToolbar from "../../widgets/StepToolbar/StepToolbar.tsx";
import NotFound from "../NotFound/NotFound.tsx";
import Start from "../Start/Start.tsx";

interface Props {
  roundNumber: number;
  stepId: string;
}

export default function Step({ roundNumber, stepId }: Props) {
  const { loadedReview } = useLoadedReviewContext();
  const roundView = useRoundView(roundNumber);
  if (!loadedReview) {
    return <Start isReviewMissing />;
  }
  const stepIndex =
    roundView?.steps.findIndex((step) => step.id === stepId) ?? -1;
  if (!roundView || stepIndex === -1) {
    return <NotFound />;
  }
  return (
    <RoundViewProvider roundView={roundView}>
      <StepPage
        loadedReview={loadedReview}
        roundView={roundView}
        stepIndex={stepIndex}
      />
    </RoundViewProvider>
  );
}

interface StepPageProps {
  loadedReview: LoadedReview;
  roundView: RoundView;
  stepIndex: number;
}

function StepPage({ loadedReview, roundView, stepIndex }: StepPageProps) {
  const stepView = roundView.steps[stepIndex]!;
  const roundNumber = roundView.round.number;
  const preferences = useDiffPreferences();
  const { dispatch } = useReviewState();
  useScrollToFragment();
  const goToStep = (index: number) => {
    const step = roundView.steps[index];
    if (step) {
      navigateTo({ name: RouteName.Step, roundNumber, stepId: step.id });
    } else if (index < 0) {
      navigateTo({ name: RouteName.Overview, roundNumber });
    }
  };
  useHotkeys([
    ["ArrowLeft", () => goToStep(stepIndex - 1)],
    ["ArrowRight", () => goToStep(stepIndex + 1)],
  ]);
  const files = stepView.files.filter(
    (file) =>
      preferences.fileFilter === "all" ||
      !roundView.previousRound ||
      file.change,
  );
  return (
    <ReviewShell
      loadedReview={loadedReview}
      roundView={roundView}
      activeStepId={stepView.id}
    >
      <Stack gap="lg">
        <StepPager roundView={roundView} stepIndex={stepIndex} />
        <StepHeader
          stepView={stepView}
          stepCount={roundView.steps.length}
          roundNumber={roundNumber}
          areExplainersHidden={preferences.explainers === "hidden"}
        />
        <StepToolbar
          preferences={preferences}
          previousRoundNumber={roundView.previousRound?.number ?? null}
          onMarkAllViewed={() =>
            dispatch({
              type: "setViewed",
              fingerprints: files.map((file) => file.fingerprint),
              viewed: true,
            })
          }
        />
        {files.map((file) => (
          <FileCard
            key={file.id}
            stepView={stepView}
            stepFileView={file}
            layout={preferences.layout}
            areExplainersHidden={preferences.explainers === "hidden"}
          />
        ))}
        <Divider />
        <StepPager roundView={roundView} stepIndex={stepIndex} />
      </Stack>
    </ReviewShell>
  );
}
