import { ActionList, ProgressBar } from "@primer/react";
import type { MouseEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import AttentionIcon from "../../design-system/badges/AttentionIcon.tsx";
import StepFileTree from "../StepFileTree/StepFileTree.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";
import styles from "./StepNavigation.module.css";

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
  const intl = useIntl();
  const viewedFingerprints = useViewedFingerprints();
  const overall = countViewedFiles(reviewView.steps, viewedFingerprints);
  const go = (stepId: string | null, fileFragment?: string) => {
    navigateTo(
      stepId === null
        ? { name: RouteName.Overview }
        : { name: RouteName.Step, stepId },
      fileFragment,
    );
    onNavigate();
  };
  const goOnClick = (stepId: string | null) => (event: MouseEvent) => {
    event.preventDefault();
    go(stepId);
  };
  return (
    // One list per step, so that the active step's file tree sits under it.
    <nav
      aria-label={intl.formatMessage({ defaultMessage: "Steps" })}
      className={styles["navigation"]}
    >
      <ActionList className={styles["overview"]}>
        <ActionList.LinkItem
          href={routeHref({ name: RouteName.Overview })}
          active={activeStepId === null}
          aria-current={activeStepId === null ? "page" : undefined}
          onClick={goOnClick(null)}
        >
          <FormattedMessage defaultMessage="Overview" />
          <ActionList.Description variant="block">
            <span className={styles["progress"]}>
              <FormattedMessage
                defaultMessage="{viewedCount} of {totalCount} files viewed"
                values={overall}
              />
              <ViewedProgress progress={overall} />
            </span>
          </ActionList.Description>
        </ActionList.LinkItem>
      </ActionList>
      {reviewView.steps.map((step) => {
        const progress = countViewedFiles([step], viewedFingerprints);
        const isActive = activeStepId === step.id;
        return (
          <div key={step.id}>
            <ActionList>
              <ActionList.LinkItem
                href={routeHref({ name: RouteName.Step, stepId: step.id })}
                active={isActive}
                aria-current={isActive ? "page" : undefined}
                onClick={goOnClick(step.id)}
              >
                {step.number}. <StepTitle step={step} />
                <ActionList.TrailingVisual>
                  <AttentionIcon attention={step.attention} />
                </ActionList.TrailingVisual>
                <ActionList.Description variant="block">
                  <span className={styles["progress"]}>
                    <ViewedProgress progress={progress} />
                  </span>
                </ActionList.Description>
              </ActionList.LinkItem>
            </ActionList>
            {isActive && (
              <StepFileTree
                stepView={step}
                onFileSelect={(fileFragment) => go(step.id, fileFragment)}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

interface ViewedProgressProps {
  progress: { viewedCount: number; totalCount: number };
}

function ViewedProgress({ progress }: ViewedProgressProps) {
  return (
    <ProgressBar
      barSize="small"
      aria-hidden
      progress={(progress.viewedCount / Math.max(progress.totalCount, 1)) * 100}
      bg={
        progress.viewedCount === progress.totalCount
          ? "success.emphasis"
          : "accent.emphasis"
      }
    />
  );
}
