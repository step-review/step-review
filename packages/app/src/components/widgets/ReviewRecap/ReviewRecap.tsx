import {
  DownloadIcon,
  EyeClosedIcon,
  FileDirectoryOpenFillIcon,
  UploadIcon,
} from "@primer/octicons-react";
import { ActionBar } from "@primer/react";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import baseFileName from "../../../business-logic/files/baseFileName.ts";
import downloadFile from "../../../business-logic/files/downloadFile.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import parseReviewState from "../../../business-logic/review-state/parseReviewState.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import HiddenFileInput from "../../design-system/HiddenFileInput/HiddenFileInput.tsx";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import ViewedProgressBar from "../../design-system/ViewedProgressBar/ViewedProgressBar.tsx";
import styles from "./ReviewRecap.module.css";

interface Props {
  loadedReview: LoadedReview;
  reviewView: ReviewView;
}

/** The open review file, how much of it was viewed, and its actions. */
export default function ReviewRecap({ loadedReview, reviewView }: Props) {
  const intl = useIntl();
  const { reviewState, dispatch } = useReviewState();
  const progress = countViewedFiles(reviewView.steps, useViewedFingerprints());
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
        <span className={styles["progressLabel"]}>
          <FormattedMessage
            defaultMessage="{viewedCount} of {totalCount} files viewed"
            values={progress}
          />
        </span>
      </div>
      <HiddenFileInput
        ref={stateFileInputRef}
        accept="application/json"
        onChange={(file) => void importState(file)}
      />
      <ActionBar
        size="small"
        gap="condensed"
        aria-label={intl.formatMessage({ defaultMessage: "Review actions" })}
        flush
      >
        <ActionBar.IconButton
          icon={FileDirectoryOpenFillIcon}
          aria-label={intl.formatMessage({
            defaultMessage: "Open another review",
          })}
          onClick={() => navigateTo({ name: RouteName.Start })}
        />
        <ActionBar.IconButton
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
        <ActionBar.IconButton
          icon={UploadIcon}
          aria-label={intl.formatMessage({
            defaultMessage: "Import viewed files",
          })}
          onClick={() => stateFileInputRef.current?.click()}
        />
        <ActionBar.IconButton
          icon={EyeClosedIcon}
          aria-label={intl.formatMessage({
            defaultMessage: "Reset viewed files",
          })}
          onClick={() => {
            if (
              window.confirm(
                intl.formatMessage({
                  defaultMessage: "Mark every file as not viewed?",
                }),
              )
            ) {
              dispatch({ type: "resetViewed" });
            }
          }}
        />
      </ActionBar>
    </section>
  );
}
