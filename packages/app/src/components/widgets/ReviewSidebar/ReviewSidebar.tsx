import { SidebarCollapseIcon } from "@primer/octicons-react";
import { IconButton } from "@primer/react";
import { useIntl } from "react-intl";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import FadingScrollArea from "../../design-system/FadingScrollArea/FadingScrollArea.tsx";
import AppBrand from "../AppBrand/AppBrand.tsx";
import ReviewRecap from "../ReviewRecap/ReviewRecap.tsx";
import SessionNotices from "../SessionNotices/SessionNotices.tsx";
import StepNavigation from "../StepNavigation/StepNavigation.tsx";
import styles from "./ReviewSidebar.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
  activeStepId: string | null;
  onNavigate: () => void;
  /** Omitted where the sidebar can't collapse into the rail. */
  onCollapse?: () => void;
}

/** The app's brand, the review's steps, and the review's recap. */
export default function ReviewSidebar({
  loadedReview,
  reviewView,
  activeStepId,
  onNavigate,
  onCollapse,
}: Props) {
  const intl = useIntl();
  return (
    <div className={styles["sidebar"]}>
      <div className={styles["brand"]}>
        <AppBrand />
      </div>
      <div className={styles["navigation"]}>
        <FadingScrollArea>
          <StepNavigation
            reviewView={reviewView}
            activeStepId={activeStepId}
            onNavigate={onNavigate}
          />
        </FadingScrollArea>
      </div>
      <div className={styles["recap"]}>
        <ReviewRecap
          loadedReview={loadedReview}
          reviewView={reviewView}
          sidebarToggle={
            onCollapse && (
              <IconButton
                tooltipDirection="n"
                variant="invisible"
                size="small"
                icon={SidebarCollapseIcon}
                aria-label={intl.formatMessage({
                  defaultMessage: "Collapse sidebar",
                })}
                onClick={onCollapse}
              />
            )
          }
        />
      </div>
      <SessionNotices />
    </div>
  );
}
