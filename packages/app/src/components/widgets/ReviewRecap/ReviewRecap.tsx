import {
  DownloadIcon,
  FileDirectoryOpenFillIcon,
  TrashIcon,
  UploadIcon,
} from "@primer/octicons-react";
import { IconButton, useConfirm } from "@primer/react";
import { useRef } from "react";
import { useIntl } from "react-intl";
import baseFileName from "../../../business-logic/files/baseFileName.ts";
import downloadFile from "../../../business-logic/files/downloadFile.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import parseReviewState from "../../../business-logic/review-state/parseReviewState.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import collectNotes from "../../../business-logic/review-view/collectNotes.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import HiddenFileInput from "../../design-system/HiddenFileInput/HiddenFileInput.tsx";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import ViewedAndNoteCounts from "../../design-system/ViewedAndNoteCounts/ViewedAndNoteCounts.tsx";
import ViewedProgressBar from "../../design-system/ViewedProgressBar/ViewedProgressBar.tsx";
import styles from "./ReviewRecap.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
}

/**
 * The open review file, its files and notes, how much of it was viewed, and its
 * actions.
 */
export default function ReviewRecap({ loadedReview, reviewView }: Props) {
  const intl = useIntl();
  const confirm = useConfirm();
  const { reviewState, dispatch } = useReviewState();
  const progress = countViewedFiles(reviewView.steps, useViewedFingerprints());
  const noteKindCounts = countNotes(collectNotes(reviewView.steps));
  const stateFileInputRef = useRef<HTMLInputElement>(null);
  const importState = async (file: File) => {
    const importedReviewState = parseReviewState(await file.text());
    if (!importedReviewState) {
      window.alert(
        intl.formatMessage({
          defaultMessage: "The file is not a valid review state.",
        }),
      );
      return;
    }
    dispatch({ type: "replace", reviewState: importedReviewState });
  };
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
          {/* Not Primer's ActionBar, which keeps its buttons' tooltips from
              opening. */}
          <div
            role="group"
            aria-label={intl.formatMessage({
              defaultMessage: "Review actions",
            })}
            className={styles["actions"]}
          >
            <IconButton
              tooltipDirection="n"
              variant="invisible"
              size="small"
              icon={FileDirectoryOpenFillIcon}
              aria-label={intl.formatMessage({
                defaultMessage: "Open another review",
              })}
              onClick={() => navigateTo({ name: RouteName.Start })}
            />
            <IconButton
              tooltipDirection="n"
              variant="invisible"
              size="small"
              icon={DownloadIcon}
              aria-label={intl.formatMessage({
                defaultMessage: "Export viewed files",
              })}
              onClick={() =>
                downloadFile(
                  `${baseFileName(loadedReview.fileName)}.state.json`,
                  JSON.stringify(reviewState, null, 2),
                  "application/json",
                )
              }
            />
            <IconButton
              tooltipDirection="n"
              variant="invisible"
              size="small"
              icon={UploadIcon}
              aria-label={intl.formatMessage({
                defaultMessage: "Import viewed files",
              })}
              onClick={() => stateFileInputRef.current?.click()}
            />
            <IconButton
              tooltipDirection="n"
              variant="invisible"
              size="small"
              className={styles["resetButton"]}
              icon={TrashIcon}
              aria-label={intl.formatMessage({
                defaultMessage: "Reset viewed files",
              })}
              onClick={async () => {
                const isConfirmed = await confirm({
                  title: intl.formatMessage({
                    defaultMessage: "Reset viewed files?",
                  }),
                  content: intl.formatMessage({
                    defaultMessage: "Every file will be marked as not viewed.",
                  }),
                  confirmButtonContent: intl.formatMessage({
                    defaultMessage: "Reset",
                  }),
                  confirmButtonType: "danger",
                });
                if (isConfirmed) {
                  dispatch({ type: "resetViewed" });
                }
              }}
            />
          </div>
        </div>
      </div>
      <HiddenFileInput
        ref={stateFileInputRef}
        accept="application/json"
        onChange={(file) => void importState(file)}
      />
    </section>
  );
}
