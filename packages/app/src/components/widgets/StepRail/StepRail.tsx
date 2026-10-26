import { useIntl } from "react-intl";
import type NavigableRoute from "../../../business-logic/navigation/NavigableRoute.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import collectNotes from "../../../business-logic/review-view/collectNotes.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import formatViewedAndNoteCounts from "../../design-system/ViewedAndNoteCounts/formatViewedAndNoteCounts.ts";
import styles from "./StepRail.module.css";
import StepRailLink from "./StepRailLink.tsx";

interface Props {
  reviewView: ReviewView;
  activeStepId: string | null;
  onNavigate: () => void;
}

/**
 * `StepNavigation` for the sidebar's rail: the steps' markers on the timeline,
 * with their titles and counts in tooltips.
 */
export default function StepRail({
  reviewView,
  activeStepId,
  onNavigate,
}: Props) {
  const intl = useIntl();
  const viewedFingerprints = useViewedFingerprints();
  const { reviewAddress } = reviewView;
  const go = (route: NavigableRoute) => {
    navigateTo(route);
    onNavigate();
  };
  return (
    <nav
      aria-label={intl.formatMessage({ defaultMessage: "Steps" })}
      className={styles["rail"]}
    >
      <StepRailLink
        route={{ name: RouteName.Overview, reviewAddress }}
        stepId={null}
        number={0}
        title={intl.formatMessage({ defaultMessage: "Overview" })}
        details={[]}
        attention="normal"
        progress={undefined}
        isActive={activeStepId === null}
        onNavigate={go}
      />
      {reviewView.steps.map((step) => {
        const progress = countViewedFiles([step], viewedFingerprints);
        const title = intl.formatMessage(
          { defaultMessage: "{number}. {title}" },
          {
            number: step.number,
            title:
              step.title ??
              intl.formatMessage({ defaultMessage: "Files in no step" }),
          },
        );
        const counts = formatViewedAndNoteCounts(intl, {
          ...progress,
          noteKindCounts: countNotes(collectNotes([step])),
        });
        return (
          <StepRailLink
            key={step.id}
            route={{ name: RouteName.Step, reviewAddress, stepId: step.id }}
            stepId={step.id}
            number={step.number}
            title={title}
            details={[counts]}
            attention={step.attention}
            progress={progress}
            isActive={activeStepId === step.id}
            onNavigate={go}
          />
        );
      })}
    </nav>
  );
}
