import { Button, Group } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import type RoundView from "../../../business-logic/rounds/RoundView.ts";
import StepTitle from "../StepTitle/StepTitle.tsx";

interface Props {
  roundView: RoundView;
  stepIndex: number;
}

export default function StepPager({ roundView, stepIndex }: Props) {
  const roundNumber = roundView.round.number;
  const previousStep = roundView.steps[stepIndex - 1];
  const nextStep = roundView.steps[stepIndex + 1];
  return (
    <Group justify="space-between">
      <Button
        variant="default"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() =>
          navigateTo(
            previousStep
              ? { name: RouteName.Step, roundNumber, stepId: previousStep.id }
              : { name: RouteName.Overview, roundNumber },
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
            navigateTo({
              name: RouteName.Step,
              roundNumber,
              stepId: nextStep.id,
            })
          }
        >
          <StepTitle step={nextStep} />
        </Button>
      )}
    </Group>
  );
}
