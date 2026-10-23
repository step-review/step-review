import { Group, NavLink, Progress, Stack, Text } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import type { MouseEvent } from "react";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import AttentionBadge from "../../design-system/badges/AttentionBadge.tsx";
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
  const go = (stepId: string | null) => (event: MouseEvent) => {
    event.preventDefault();
    navigateTo(
      stepId === null
        ? { name: RouteName.Overview }
        : { name: RouteName.Step, stepId },
    );
    onNavigate();
  };
  return (
    <Stack gap="xs">
      <div>
        <Progress
          value={
            overall.totalCount
              ? (overall.viewedCount / overall.totalCount) * 100
              : 0
          }
          color={
            overall.viewedCount === overall.totalCount ? "success" : "brand"
          }
          size="sm"
        />
        <Text size="xs" c="dimmed" mt={4}>
          <FormattedMessage
            defaultMessage="{viewedCount} of {totalCount} files viewed"
            values={overall}
          />
        </Text>
      </div>
      <NavLink
        component="a"
        href={routeHref({ name: RouteName.Overview })}
        label={<FormattedMessage defaultMessage="Overview" />}
        leftSection={<IconHome size={16} />}
        active={activeStepId === null}
        onClick={go(null)}
      />
      {reviewView.steps.map((step) => {
        const progress = countViewedFiles([step], viewedFingerprints);
        return (
          <NavLink
            key={step.id}
            component="a"
            href={routeHref({ name: RouteName.Step, stepId: step.id })}
            active={activeStepId === step.id}
            onClick={go(step.id)}
            leftSection={
              <Text size="xs" c="dimmed" w={18} ta="right">
                {step.number}
              </Text>
            }
            label={<StepTitle step={step} />}
            description={
              <Stack gap={4} mt={4}>
                <Group gap={4}>
                  <AttentionBadge attention={step.attention} size="xs" />
                </Group>
                <Progress
                  size={4}
                  value={
                    (progress.viewedCount / Math.max(progress.totalCount, 1)) *
                    100
                  }
                  color={
                    progress.viewedCount === progress.totalCount
                      ? "success"
                      : "brand"
                  }
                />
              </Stack>
            }
          />
        );
      })}
    </Stack>
  );
}
