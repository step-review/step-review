import { Group, NavLink, Progress, Stack, Text } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import type { MouseEvent, ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useFragment from "../../../business-logic/navigation/useFragment.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import AttentionBadge from "../../design-system/badges/AttentionBadge.tsx";
import FileIcon from "../FileIcon/FileIcon.tsx";
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
  const fragment = useFragment();
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
          <LinkStatus progress={overall}>
            <Text size="xs" c="dimmed">
              <FormattedMessage
                defaultMessage="{viewedCount} of {totalCount} files viewed"
                values={overall}
              />
            </Text>
          </LinkStatus>
        }
        leftSection={<IconHome size={16} />}
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
            py={6}
            href={routeHref({ name: RouteName.Step, stepId: step.id })}
            active={activeStepId === step.id}
            opened={activeStepId === step.id}
            // The active step is always open: no chevron to toggle it.
            rightSection={null}
            onClick={go(step.id)}
            childrenOffset="xs"
            label={
              <>
                {step.number}. <StepTitle step={step} />
              </>
            }
            description={
              <LinkStatus progress={progress}>
                <AttentionBadge attention={step.attention} size="xs" />
              </LinkStatus>
            }
          >
            {step.files.map((file) => {
              const fileFragment = `file-${file.id}`;
              const separatorIndex = file.path.lastIndexOf("/");
              const isViewed = viewedFingerprints.has(file.fingerprint);
              return (
                <NavLink
                  key={file.id}
                  component="a"
                  px="xs"
                  py={2}
                  href={`${routeHref({ name: RouteName.Step, stepId: step.id })}#${encodeURIComponent(fileFragment)}`}
                  active={fragment === fileFragment}
                  onClick={go(step.id, fileFragment)}
                  noWrap
                  title={file.path}
                  leftSection={<FileIcon path={file.path} />}
                  label={
                    // Viewed files are dimmed; the directory follows the name
                    // on the same line, cut off when it doesn't fit.
                    <Text span size="xs" c={isViewed ? "dimmed" : undefined}>
                      {file.path.slice(separatorIndex + 1)}{" "}
                      <Text span inherit c="dimmed" ml={4}>
                        {file.path.slice(0, Math.max(separatorIndex, 0))}
                      </Text>
                    </Text>
                  }
                />
              );
            })}
          </NavLink>
        );
      })}
    </Stack>
  );
}

interface LinkStatusProps {
  progress: { viewedCount: number; totalCount: number };
  children: ReactNode;
}

/**
 * A detail line, then the viewed files as a bar. The detail line keeps its
 * height when empty, so every link has the same height.
 */
function LinkStatus({ progress, children }: LinkStatusProps) {
  return (
    <Stack gap={6} mt={4}>
      <Group h={16}>{children}</Group>
      <Progress
        size={4}
        value={(progress.viewedCount / Math.max(progress.totalCount, 1)) * 100}
        color={
          progress.viewedCount === progress.totalCount ? "success" : "brand"
        }
      />
    </Stack>
  );
}
