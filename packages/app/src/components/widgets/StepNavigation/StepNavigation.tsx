import { Group, NavLink, Progress, Stack, Text } from "@mantine/core";
import type { MouseEvent } from "react";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import AttentionIcon from "../../design-system/badges/AttentionIcon.tsx";
import StepFileTree from "../StepFileTree/StepFileTree.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";

interface Props {
  reviewView: ReviewView;
  activeStepId: string | null;
  onNavigate: () => void;
}

export default function StepNavigation({
  reviewView,
  activeStepId,
  onNavigate,
}: Props) {
  const viewedFingerprints = useViewedFingerprints();
  const overall = countViewedFiles(reviewView.steps, viewedFingerprints);
  const go =
    (stepId: string | null, fileFragment?: string) => (event: MouseEvent) => {
      event.preventDefault();
      navigateTo(
        stepId === null
          ? { name: RouteName.Overview }
          : { name: RouteName.Step, stepId },
        fileFragment,
      );
      onNavigate();
    };
  return (
    <Stack gap={2}>
      <NavLink
        component="a"
        px="xs"
        py={6}
        href={routeHref({ name: RouteName.Overview })}
        label={<FormattedMessage defaultMessage="Overview" />}
        description={
          <Stack gap={6} mt={4}>
            <Text size="xs" c="dimmed">
              <FormattedMessage
                defaultMessage="{viewedCount} of {totalCount} files viewed"
                values={overall}
              />
            </Text>
            <ViewedProgress progress={overall} />
          </Stack>
        }
        active={activeStepId === null}
        onClick={go(null)}
        mb="md"
      />
      {reviewView.steps.map((step) => {
        const progress = countViewedFiles([step], viewedFingerprints);
        return (
          <NavLink
            key={step.id}
            component="a"
            px="xs"
            py={10}
            href={routeHref({ name: RouteName.Step, stepId: step.id })}
            active={activeStepId === step.id}
            opened={activeStepId === step.id}
            // The active step is always open: no chevron to toggle it.
            rightSection={null}
            onClick={go(step.id)}
            childrenOffset="xs"
            label={
              <Group gap={6} wrap="nowrap" justify="space-between">
                <span>
                  {step.number}. <StepTitle step={step} />
                </span>
                <AttentionIcon attention={step.attention} />
              </Group>
            }
            description={<ViewedProgress progress={progress} mt={6} />}
          >
            <StepFileTree
              stepView={step}
              onFileClick={(event, fileFragment) =>
                go(step.id, fileFragment)(event)
              }
            />
          </NavLink>
        );
      })}
    </Stack>
  );
}

interface ViewedProgressProps {
  progress: { viewedCount: number; totalCount: number };
  mt?: number;
}

function ViewedProgress({ progress, mt }: ViewedProgressProps) {
  return (
    <Progress
      mt={mt}
      size={4}
      value={(progress.viewedCount / Math.max(progress.totalCount, 1)) * 100}
      color={progress.viewedCount === progress.totalCount ? "success" : "brand"}
    />
  );
}
