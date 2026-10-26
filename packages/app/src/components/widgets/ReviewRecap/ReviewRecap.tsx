import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import collectNotes from "../../../business-logic/review-view/collectNotes.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import ViewedAndNoteCounts from "../../design-system/ViewedAndNoteCounts/ViewedAndNoteCounts.tsx";
import ViewedProgressBar from "../../design-system/ViewedProgressBar/ViewedProgressBar.tsx";
import ReviewActions from "../ReviewActions/ReviewActions.tsx";
import styles from "./ReviewRecap.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
  /** After the review's actions, e.g. to collapse the sidebar. */
  sidebarToggle?: ReactNode;
}

/**
 * The open review file, its files and notes, how much of it was viewed, and its
 * actions.
 */
export default function ReviewRecap({
  loadedReview,
  reviewView,
  sidebarToggle,
}: Props) {
  const intl = useIntl();
  const progress = countViewedFiles(reviewView.steps, useViewedFingerprints());
  const noteKindCounts = countNotes(collectNotes(reviewView.steps));
  return (
    <section
      className={styles["recap"]}
      aria-label={intl.formatMessage({ defaultMessage: "Review" })}
    >
      <div className={styles["fileName"]}>
        <TruncatedText tooltip={loadedReview.fileName}>
          {loadedReview.fileName}
        </TruncatedText>
      </div>
      <div className={styles["progress"]}>
        <ViewedProgressBar {...progress} />
        <div className={styles["statusRow"]}>
          <span className={styles["stats"]}>
            <ViewedAndNoteCounts
              {...progress}
              noteKindCounts={noteKindCounts}
            />
          </span>
          <div className={styles["actions"]}>
            <ReviewActions
              loadedReview={loadedReview}
              reviewView={reviewView}
            />
            {sidebarToggle}
          </div>
        </div>
      </div>
    </section>
  );
}
