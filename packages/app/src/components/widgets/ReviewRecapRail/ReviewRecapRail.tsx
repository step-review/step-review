import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import collectNotes from "../../../business-logic/review-view/collectNotes.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import AnchoredTooltip from "../../design-system/AnchoredTooltip/AnchoredTooltip.tsx";
import formatViewedAndNoteCounts from "../../design-system/ViewedAndNoteCounts/formatViewedAndNoteCounts.ts";
import ViewedProgressRing from "../../design-system/ViewedProgressRing/ViewedProgressRing.tsx";
import CollaborationSessionButton from "../CollaborationSessionButton/CollaborationSessionButton.tsx";
import styles from "./ReviewRecapRail.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
}

/**
 * `ReviewRecap` for the sidebar's rail: how much of the review was viewed, as a
 * ring with the file and counts in its tooltip, and the collaboration session's
 * button. The other actions wait for the full sidebar.
 */
export default function ReviewRecapRail({ loadedReview, reviewView }: Props) {
  const intl = useIntl();
  const progressRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const progress = countViewedFiles(reviewView.steps, useViewedFingerprints());
  const label = intl.formatMessage(
    { defaultMessage: "{fileName}: {counts}" },
    {
      fileName: loadedReview.fileName,
      counts: formatViewedAndNoteCounts(intl, {
        ...progress,
        noteKindCounts: countNotes(collectNotes(reviewView.steps)),
      }),
    },
  );
  return (
    <section
      className={styles["recap"]}
      aria-label={intl.formatMessage({ defaultMessage: "Review" })}
    >
      <span
        ref={progressRef}
        role="img"
        aria-label={label}
        className={styles["progress"]}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        <ViewedProgressRing {...progress} />
        <span className={styles["percentage"]} aria-hidden>
          {intl.formatNumber(
            // Rounded down, so that 100% means every file was viewed.
            Math.floor(
              (progress.viewedCount / Math.max(progress.totalCount, 1)) * 100,
            ) / 100,
            { style: "percent" },
          )}
        </span>
      </span>
      <AnchoredTooltip
        anchorRef={progressRef}
        isOpen={isTooltipOpen}
        text={label}
        side="outside-right"
      />
      <CollaborationSessionButton orientation="vertical" />
    </section>
  );
}
