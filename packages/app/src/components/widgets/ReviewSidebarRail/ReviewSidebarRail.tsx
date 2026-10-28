import { SidebarExpandIcon } from "@primer/octicons-react";
import { IconButton, Tooltip } from "@primer/react";
import { useIntl } from "react-intl";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import FadingScrollArea from "../../design-system/FadingScrollArea/FadingScrollArea.tsx";
import Logo from "../../design-system/Logo/Logo.tsx";
import ReviewRecapRail from "../ReviewRecapRail/ReviewRecapRail.tsx";
import RouteLink from "../RouteLink/RouteLink.tsx";
import SessionNotices from "../SessionNotices/SessionNotices.tsx";
import StepRail from "../StepRail/StepRail.tsx";
import styles from "./ReviewSidebarRail.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
  activeStepId: string | null;
  onNavigate: () => void;
  onExpand: () => void;
}

/**
 * `ReviewSidebar` collapsed into a rail: the logo, the steps' markers, and the
 * recap's progress and actions, with the rest in tooltips.
 */
export default function ReviewSidebarRail({
  loadedReview,
  reviewView,
  activeStepId,
  onNavigate,
  onExpand,
}: Props) {
  const intl = useIntl();
  return (
    <div className={styles["rail"]}>
      <div className={styles["brand"]}>
        <Tooltip text="Step Review" type="label" direction="e">
          <RouteLink
            route={{ name: RouteName.Start }}
            className={styles["home"]}
          >
            <Logo size={32} />
          </RouteLink>
        </Tooltip>
      </div>
      <div className={styles["navigation"]}>
        <FadingScrollArea>
          <StepRail
            reviewView={reviewView}
            activeStepId={activeStepId}
            onNavigate={onNavigate}
          />
        </FadingScrollArea>
      </div>
      <div className={styles["recap"]}>
        <ReviewRecapRail loadedReview={loadedReview} reviewView={reviewView} />
        <SessionNotices isCompact />
        <IconButton
          tooltipDirection="e"
          variant="invisible"
          size="small"
          icon={SidebarExpandIcon}
          aria-label={intl.formatMessage({ defaultMessage: "Expand sidebar" })}
          onClick={onExpand}
        />
      </div>
    </div>
  );
}
