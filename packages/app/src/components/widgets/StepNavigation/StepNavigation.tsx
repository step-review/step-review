import { ActionList } from "@primer/react";
import type { MouseEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import collectNotes from "../../../business-logic/review-view/collectNotes.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import AttentionIcon from "../../design-system/badges/AttentionIcon.tsx";
import ViewedAndNoteCounts from "../../design-system/ViewedAndNoteCounts/ViewedAndNoteCounts.tsx";
import ViewedProgressBar from "../../design-system/ViewedProgressBar/ViewedProgressBar.tsx";
import ParticipantsHere from "../ParticipantsHere/ParticipantsHere.tsx";
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
  const { reviewAddress } = reviewView;
  const go = (stepId: string | null, fileFragment?: string) => {
    navigateTo(
      stepId === null
        ? { name: RouteName.Overview, reviewAddress }
        : { name: RouteName.Step, reviewAddress, stepId },
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
      <ActionList>
        <ActionList.LinkItem
          href={routeHref({ name: RouteName.Overview, reviewAddress })}
          active={activeStepId === null}
          aria-current={activeStepId === null ? "page" : undefined}
          onClick={goOnClick(null)}
        >
          <span className={styles["stepLabel"]}>
            <FormattedMessage defaultMessage="0. Overview" />
            <ParticipantsHere stepId={null} />
          </span>
        </ActionList.LinkItem>
      </ActionList>
      {reviewView.steps.map((step) => {
        const progress = countViewedFiles([step], viewedFingerprints);
        const isActive = activeStepId === step.id;
        return (
          <div key={step.id}>
            <ActionList>
              <ActionList.LinkItem
                href={routeHref({
                  name: RouteName.Step,
                  reviewAddress,
                  stepId: step.id,
                })}
                active={isActive}
                aria-current={isActive ? "page" : undefined}
                onClick={goOnClick(step.id)}
              >
                {/* In the label, not a trailing visual, so that the
                    progress bar below spans the whole item. */}
                <span className={styles["stepLabel"]}>
                  <span>
                    {step.number}. <StepTitle step={step} />
                  </span>
                  <span className={styles["stepMarks"]}>
                    <ParticipantsHere stepId={step.id} />
                    <AttentionIcon attention={step.attention} />
                  </span>
                </span>
                <ActionList.Description
                  variant="block"
                  className={styles["description"]}
                >
                  <ViewedAndNoteCounts
                    {...progress}
                    noteKindCounts={countNotes(collectNotes([step]))}
                  />
                  <span className={styles["progress"]}>
                    <ViewedProgressBar {...progress} />
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
      {/* Not a step: shows that the list ended, as the overview starts it. */}
      <p className={styles["end"]}>
        <FormattedMessage defaultMessage="End" />
      </p>
    </nav>
  );
}
