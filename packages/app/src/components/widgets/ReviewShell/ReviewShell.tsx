import { ThreeBarsIcon, XIcon } from "@primer/octicons-react";
import {
  Dialog,
  IconButton,
  SplitPageLayout,
  VisuallyHidden,
} from "@primer/react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import useStoredNumber from "../../../business-logic/storage/useStoredNumber.ts";
import useStoredPreference from "../../../business-logic/storage/useStoredPreference.ts";
import useViewportWidth from "../../design-system/hooks/useViewportWidth.ts";
import Logo from "../../design-system/Logo/Logo.tsx";
import CollaborationSessionDialog from "../CollaborationSessionDialog/CollaborationSessionDialog.tsx";
import { useCollaborationSessionDialogState } from "../CollaborationSessionDialog/CollaborationSessionDialogProvider.tsx";
import JoinSessionDialog from "../JoinSessionDialog/JoinSessionDialog.tsx";
import OpenReviewDropzone from "../OpenReviewDropzone/OpenReviewDropzone.tsx";
import ReviewSidebar from "../ReviewSidebar/ReviewSidebar.tsx";
import ReviewSidebarRail from "../ReviewSidebarRail/ReviewSidebarRail.tsx";
import computeSidebarLayout from "./computeSidebarLayout.ts";
import styles from "./ReviewShell.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
  activeStepId: string | null;
  children: ReactNode;
}

/**
 * The 32px logo with the full sidebar's 16px padding on both sides, so that
 * nothing moves when the sidebar collapses.
 */
const railWidth = "64px";

export default function ReviewShell({
  loadedReview,
  reviewView,
  activeStepId,
  children,
}: Props) {
  const intl = useIntl();
  const { reviewState } = useReviewState();
  const collaborationSessionDialogState = useCollaborationSessionDialogState();
  const [isStackedSidebarOpen, setIsStackedSidebarOpen] = useState(false);
  const [isSidebarOverlayOpen, setIsSidebarOverlayOpen] = useState(false);
  const [sidebarState, setSidebarState] = useStoredPreference(
    "step-review:sidebar",
    ["expanded", "collapsed"],
    "expanded",
  );
  const { isStacked, hasRoomForSidebar, sidebarWidthRange } =
    computeSidebarLayout(useViewportWidth());
  // Starts at its minimum width, which it keeps until it collapses.
  const [sidebarWidth, setSidebarWidth] = useStoredNumber(
    "step-review:sidebar-width",
    sidebarWidthRange.min,
  );
  // Collapsed when chosen, and wherever the full sidebar would squeeze the
  // content, without changing the choice.
  const isRail =
    !isStacked && (sidebarState === "collapsed" || !hasRoomForSidebar);
  // The full sidebar opens over the content only while it has no room beside
  // it. Forgotten once it has, so that it doesn't reopen when the room runs
  // out again.
  if (isSidebarOverlayOpen && (!isRail || hasRoomForSidebar)) {
    setIsSidebarOverlayOpen(false);
  }
  const closeSidebars = () => {
    setIsStackedSidebarOpen(false);
    setIsSidebarOverlayOpen(false);
  };
  const expandSidebar = () => {
    if (hasRoomForSidebar) {
      setSidebarState("expanded");
    } else {
      setIsSidebarOverlayOpen(true);
    }
  };
  const goToStart = () => navigateTo({ name: RouteName.Start });
  const sidebarLabel = intl.formatMessage({ defaultMessage: "Steps" });
  const paneProps = {
    position: "start",
    padding: "none",
    hidden: { narrow: !isStackedSidebarOpen },
    "aria-label": sidebarLabel,
  } as const;
  return (
    <>
      {/* On narrow screens the sidebar is above the content, so a header
          shows or hides it. Wider screens show it beside the content, full or
          collapsed into a rail. */}
      <SplitPageLayout>
        <SplitPageLayout.Header
          padding="condensed"
          hidden={{ regular: true, wide: true }}
        >
          <div className={styles["header"]}>
            <IconButton
              variant="invisible"
              icon={isStackedSidebarOpen ? XIcon : ThreeBarsIcon}
              aria-label={intl.formatMessage({
                defaultMessage: "Show or hide the steps",
              })}
              aria-expanded={isStackedSidebarOpen}
              onClick={() => setIsStackedSidebarOpen((isOpen) => !isOpen)}
            />
            <Brand onClick={goToStart} />
          </div>
        </SplitPageLayout.Header>
        {isRail ? (
          <SplitPageLayout.Pane
            {...paneProps}
            width={{ min: railWidth, default: railWidth, max: railWidth }}
          >
            <ReviewSidebarRail
              loadedReview={loadedReview}
              reviewView={reviewView}
              activeStepId={activeStepId}
              onNavigate={closeSidebars}
              onExpand={expandSidebar}
            />
          </SplitPageLayout.Pane>
        ) : (
          <SplitPageLayout.Pane
            {...paneProps}
            resizable
            width={{
              min: `${sidebarWidthRange.min}px`,
              default: `${sidebarWidthRange.min}px`,
              max: `${sidebarWidthRange.max}px`,
            }}
            // Narrowed with the viewport, then back to the chosen width.
            currentWidth={Math.min(sidebarWidth, sidebarWidthRange.max)}
            onResizeEnd={setSidebarWidth}
          >
            <ReviewSidebar
              loadedReview={loadedReview}
              reviewView={reviewView}
              activeStepId={activeStepId}
              onNavigate={closeSidebars}
              onCollapse={
                isStacked ? undefined : () => setSidebarState("collapsed")
              }
            />
          </SplitPageLayout.Pane>
        )}
        <SplitPageLayout.Content width="full">
          {children}
        </SplitPageLayout.Content>
      </SplitPageLayout>
      {isSidebarOverlayOpen && (
        <Dialog
          position="left"
          width={`${sidebarWidth}px`}
          onClose={() => setIsSidebarOverlayOpen(false)}
          renderHeader={({ dialogLabelId }) => (
            <VisuallyHidden id={dialogLabelId}>{sidebarLabel}</VisuallyHidden>
          )}
          renderBody={() => (
            <ReviewSidebar
              loadedReview={loadedReview}
              reviewView={reviewView}
              activeStepId={activeStepId}
              onNavigate={closeSidebars}
              onCollapse={() => setIsSidebarOverlayOpen(false)}
            />
          )}
        />
      )}
      {collaborationSessionDialogState.isOpen && (
        <CollaborationSessionDialog
          loadedReview={loadedReview}
          viewedFingerprints={reviewState.viewedFingerprints}
        />
      )}
      <JoinSessionDialog />
      <OpenReviewDropzone />
    </>
  );
}

interface BrandProps {
  onClick: () => void;
}

function Brand({ onClick }: BrandProps) {
  return (
    <button type="button" className={styles["headerBrand"]} onClick={onClick}>
      <Logo size={24} />
      Step Review
    </button>
  );
}
