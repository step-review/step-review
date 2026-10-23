import { Button, Group } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
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
  const previousStep = reviewView.steps[stepIndex - 1];
  const nextStep = reviewView.steps[stepIndex + 1];
  return (
    <Group justify="space-between">
      <Button
        variant="default"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() =>
          navigateTo(
            previousStep
              ? { name: RouteName.Step, stepId: previousStep.id }
              : { name: RouteName.Overview },
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
          rightSection={<IconArrowRight size={16} />}
          onClick={() =>
            navigateTo({ name: RouteName.Step, stepId: nextStep.id })
          }
        >
          <StepTitle step={nextStep} />
        </Button>
      )}
    </Group>
  );
}
