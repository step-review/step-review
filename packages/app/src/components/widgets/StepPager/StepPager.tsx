import { ArrowLeftIcon, ArrowRightIcon } from "@primer/octicons-react";
import { Button, Stack } from "@primer/react";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import StepTitle from "../StepTitle/StepTitle.tsx";

interface Props {
  reviewView: ReviewView;
  stepIndex: number;
}

export default function StepPager({ reviewView, stepIndex }: Props) {
  const { reviewId } = reviewView;
  const previousStep = reviewView.steps[stepIndex - 1];
  const nextStep = reviewView.steps[stepIndex + 1];
  return (
    <Stack direction="horizontal" justify="space-between" wrap="wrap">
      <Button
        leadingVisual={ArrowLeftIcon}
        onClick={() =>
          navigateTo(
            previousStep
              ? { name: RouteName.Step, reviewId, stepId: previousStep.id }
              : { name: RouteName.Overview, reviewId },
          )
        }
      >
        {previousStep ? (
          <StepTitle step={previousStep} />
        ) : (
          <FormattedMessage defaultMessage="Overview" />
        )}
      </Button>
      {nextStep && (
        <Button
          variant="primary"
          trailingVisual={ArrowRightIcon}
          onClick={() =>
            navigateTo({ name: RouteName.Step, reviewId, stepId: nextStep.id })
          }
        >
          <StepTitle step={nextStep} />
        </Button>
      )}
    </Stack>
  );
}
