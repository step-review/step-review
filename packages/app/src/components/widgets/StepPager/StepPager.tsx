import { ArrowLeftIcon, ArrowRightIcon } from "@primer/octicons-react";
import { Button, Stack } from "@primer/react";
import { FormattedMessage } from "react-intl";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import RouteLink from "../RouteLink/RouteLink.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";

interface Props {
  reviewView: ReviewView;
  stepIndex: number;
}

export default function StepPager({ reviewView, stepIndex }: Props) {
  const { reviewAddress } = reviewView;
  const previousStep = reviewView.steps[stepIndex - 1];
  const nextStep = reviewView.steps[stepIndex + 1];
  return (
    <Stack direction="horizontal" justify="space-between" wrap="wrap">
      <Button
        as={RouteLink}
        route={
          previousStep
            ? { name: RouteName.Step, reviewAddress, stepId: previousStep.id }
            : { name: RouteName.Overview, reviewAddress }
        }
        leadingVisual={ArrowLeftIcon}
      >
        {previousStep ? (
          <StepTitle step={previousStep} />
        ) : (
          <FormattedMessage defaultMessage="Overview" />
        )}
      </Button>
      {nextStep && (
        <Button
          as={RouteLink}
          route={{ name: RouteName.Step, reviewAddress, stepId: nextStep.id }}
          variant="primary"
          trailingVisual={ArrowRightIcon}
        >
          <StepTitle step={nextStep} />
        </Button>
      )}
    </Stack>
  );
}
