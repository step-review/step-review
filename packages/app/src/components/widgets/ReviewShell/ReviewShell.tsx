import { ThreeBarsIcon, XIcon } from "@primer/octicons-react";
import { IconButton, SplitPageLayout } from "@primer/react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import Logo from "../../design-system/Logo/Logo.tsx";
import AppBrand from "../AppBrand/AppBrand.tsx";
import ReloadDropzone from "../ReloadDropzone/ReloadDropzone.tsx";
import ReviewRecap from "../ReviewRecap/ReviewRecap.tsx";
import SessionNotices from "../SessionNotices/SessionNotices.tsx";
import StepNavigation from "../StepNavigation/StepNavigation.tsx";
import styles from "./ReviewShell.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
  activeStepId: string | null;
  children: ReactNode;
}

export default function ReviewShell({
  loadedReview,
  reviewView,
  activeStepId,
  children,
}: Props) {
  const intl = useIntl();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const goToStart = () => navigateTo({ name: RouteName.Start });
  return (
    <>
      {/* On narrow screens the navigation is above the content, so a header
          shows or hides it. Wider screens always show it. */}
      <SplitPageLayout>
        <SplitPageLayout.Header
          padding="condensed"
          hidden={{ regular: true, wide: true }}
        >
          <div className={styles["header"]}>
            <IconButton
              variant="invisible"
              icon={isNavigationOpen ? XIcon : ThreeBarsIcon}
              aria-label={intl.formatMessage({
                defaultMessage: "Show or hide the steps",
              })}
              aria-expanded={isNavigationOpen}
              onClick={() => setIsNavigationOpen((isOpen) => !isOpen)}
            />
            <Brand onClick={goToStart} />
          </div>
        </SplitPageLayout.Header>
        <SplitPageLayout.Pane
          position="start"
          padding="none"
          resizable
          widthStorageKey="step-review:navigation-width"
          width={{ min: "256px", default: "360px", max: "600px" }}
          hidden={{ narrow: !isNavigationOpen }}
          aria-label={intl.formatMessage({ defaultMessage: "Steps" })}
        >
          <div className={styles["pane"]}>
            <div className={styles["brand"]}>
              <AppBrand />
            </div>
            <div className={styles["navigation"]}>
              <StepNavigation
                reviewView={reviewView}
                activeStepId={activeStepId}
                onNavigate={() => setIsNavigationOpen(false)}
              />
            </div>
            <div className={styles["recap"]}>
              <ReviewRecap
                loadedReview={loadedReview}
                reviewView={reviewView}
              />
            </div>
            <SessionNotices />
          </div>
        </SplitPageLayout.Pane>
        <SplitPageLayout.Content width="full">
          {children}
        </SplitPageLayout.Content>
      </SplitPageLayout>
      <ReloadDropzone />
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
