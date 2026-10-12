import { Stack, Title } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useScrollToFragment from "../../../business-logic/navigation/useScrollToFragment.ts";
import { useLoadedReviewContext } from "../../../business-logic/review/LoadedReviewProvider.tsx";
import RoundViewProvider from "../../../business-logic/rounds/RoundViewProvider.tsx";
import useRoundView from "../../../business-logic/rounds/useRoundView.ts";
import IssuesIndex from "../../widgets/IssuesIndex/IssuesIndex.tsx";
import OverviewHeader from "../../widgets/OverviewHeader/OverviewHeader.tsx";
import OverviewSummary from "../../widgets/OverviewSummary/OverviewSummary.tsx";
import PreviousRoundSummary from "../../widgets/PreviousRoundSummary/PreviousRoundSummary.tsx";
import ReviewShell from "../../widgets/ReviewShell/ReviewShell.tsx";
import ReviewWarnings from "../../widgets/ReviewWarnings/ReviewWarnings.tsx";
import StepList from "../../widgets/StepList/StepList.tsx";
import NotFound from "../NotFound/NotFound.tsx";
import Start from "../Start/Start.tsx";

interface Props {
  roundNumber: number;
}

export default function Overview({ roundNumber }: Props) {
  const { loadedReview } = useLoadedReviewContext();
  const roundView = useRoundView(roundNumber);
  useScrollToFragment();
  useHotkeys([
    [
      "ArrowRight",
      () => {
        const firstStep = roundView?.steps[0];
        if (firstStep) {
          navigateTo({
            name: RouteName.Step,
            roundNumber,
            stepId: firstStep.id,
          });
        }
      },
    ],
  ]);
  if (!loadedReview) {
    return <Start isReviewMissing />;
  }
  if (!roundView) {
    return <NotFound />;
  }
  return (
    <RoundViewProvider roundView={roundView}>
      <ReviewShell
        loadedReview={loadedReview}
        roundView={roundView}
        activeStepId={null}
      >
        <Stack gap="xl" maw={1100}>
          <OverviewHeader />
          <ReviewWarnings
            loadedReview={loadedReview}
            roundNumber={roundNumber}
          />
          <OverviewSummary />
          <PreviousRoundSummary />
          <Stack gap="sm">
            <Title order={3}>
              <FormattedMessage defaultMessage="Steps" />
            </Title>
            <StepList />
          </Stack>
          <IssuesIndex />
        </Stack>
      </ReviewShell>
    </RoundViewProvider>
  );
}
