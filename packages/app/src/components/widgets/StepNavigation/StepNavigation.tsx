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
import StepMarker from "../../design-system/StepMarker/StepMarker.tsx";
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
    // A line joins the steps' markers into a timeline.
    <nav
      aria-label={intl.formatMessage({ defaultMessage: "Steps" })}
      className={styles["navigation"]}
    >
      <ActionList>
        <ActionList.LinkItem
          href={routeHref({ name: RouteName.Overview, reviewAddress })}
          className={activeStepId === null ? styles["current"] : undefined}
          aria-current={activeStepId === null ? "page" : undefined}
          onClick={goOnClick(null)}
        >
          <ActionList.LeadingVisual>
            <StepMarker number={0} isActive={activeStepId === null} />
          </ActionList.LeadingVisual>
          <span className={styles["stepLabel"]}>
            <FormattedMessage defaultMessage="Overview" />
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
                className={isActive ? styles["current"] : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={goOnClick(step.id)}
              >
                <ActionList.LeadingVisual>
                  <StepMarker number={step.number} isActive={isActive} />
                </ActionList.LeadingVisual>
                {/* In the label, not a trailing visual, so that the
                    progress bar below spans the whole item. */}
                <span className={styles["stepLabel"]}>
                  <span>
                    <StepTitle step={step} />
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
              <div className={styles["fileTree"]}>
                <StepFileTree
                  stepView={step}
                  onFileSelect={(fileFragment) => go(step.id, fileFragment)}
                />
              </div>
            )}
          </div>
        );
      })}
      {/* Not a step: where the timeline ends. Decorative, so hidden from
          assistive technology, for which the list ends anyway. */}
      <p className={styles["end"]} aria-hidden>
        <FormattedMessage defaultMessage="End" />
      </p>
    </nav>
  );
}
