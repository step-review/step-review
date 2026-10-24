import {
  DownloadIcon,
  FileDirectoryOpenFillIcon,
  KebabHorizontalIcon,
  ShareIcon,
  SignOutIcon,
  TrashIcon,
  UndoIcon,
  UploadIcon,
} from "@primer/octicons-react";
import { ActionList, ActionMenu, IconButton, useConfirm } from "@primer/react";
import { useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import baseFileName from "../../../business-logic/files/baseFileName.ts";
import downloadFile from "../../../business-logic/files/downloadFile.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import parseReviewState from "../../../business-logic/review-state/parseReviewState.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import useViewedFingerprints from "../../../business-logic/review-state/useViewedFingerprints.ts";
import deleteReview from "../../../business-logic/review-store/deleteReview.ts";
import collectNotes from "../../../business-logic/review-view/collectNotes.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import countViewedFiles from "../../../business-logic/review-view/countViewedFiles.ts";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import exampleReviewId from "../../../business-logic/review/exampleReviewId.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import { useShareSessionContext } from "../../../business-logic/share-session/ShareSessionProvider.tsx";
import HiddenFileInput from "../../design-system/HiddenFileInput/HiddenFileInput.tsx";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import ViewedAndNoteCounts from "../../design-system/ViewedAndNoteCounts/ViewedAndNoteCounts.tsx";
import ViewedProgressBar from "../../design-system/ViewedProgressBar/ViewedProgressBar.tsx";
import ShareLinkDialog from "../ShareLinkDialog/ShareLinkDialog.tsx";
import ShareReviewDialog from "../ShareReviewDialog/ShareReviewDialog.tsx";
import styles from "./ReviewRecap.module.css";
import useLeaveSharedReview from "./useLeaveSharedReview.ts";

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
  const shareBookmark = useShareSessionContext()?.shareBookmark ?? null;
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
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
  const exportState = () =>
    downloadFile(
      `${baseFileName(loadedReview.fileName)}.state.json`,
      JSON.stringify(reviewState, null, 2),
      "application/json",
    );
  const resetState = async () => {
    const isConfirmed = await confirm({
      title: intl.formatMessage({ defaultMessage: "Reset review state?" }),
      content: intl.formatMessage({
        defaultMessage: "Every file will be marked as not viewed.",
      }),
      confirmButtonContent: intl.formatMessage({ defaultMessage: "Reset" }),
      confirmButtonType: "danger",
    });
    if (isConfirmed) {
      dispatch({ type: "resetViewed" });
    }
  };
  const leaveSharedReview = useLeaveSharedReview(shareBookmark);
  const deleteLoadedReview = async () => {
    const isConfirmed = await confirm({
      title: intl.formatMessage({ defaultMessage: "Delete review?" }),
      content: intl.formatMessage({
        defaultMessage:
          "The review file and its review state will be removed from this browser.",
      }),
      confirmButtonContent: intl.formatMessage({ defaultMessage: "Delete" }),
      confirmButtonType: "danger",
    });
    if (isConfirmed) {
      // Leave first, so the page doesn't show the review as missing.
      navigateTo({ name: RouteName.Start });
      await deleteReview(loadedReview.reviewId);
    }
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
          <div className={styles["actions"]}>
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton
                  tooltipDirection="n"
                  variant="invisible"
                  size="small"
                  icon={KebabHorizontalIcon}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Review actions",
                  })}
                />
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item
                    onSelect={() => navigateTo({ name: RouteName.Start })}
                  >
                    <ActionList.LeadingVisual>
                      <FileDirectoryOpenFillIcon />
                    </ActionList.LeadingVisual>
                    <FormattedMessage defaultMessage="Open another review" />
                  </ActionList.Item>
                  <ActionList.Item onSelect={() => setIsShareDialogOpen(true)}>
                    <ActionList.LeadingVisual>
                      <ShareIcon />
                    </ActionList.LeadingVisual>
                    {shareBookmark ? (
                      <FormattedMessage defaultMessage="Invite to the review" />
                    ) : (
                      <FormattedMessage defaultMessage="Share the review" />
                    )}
                  </ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item onSelect={exportState}>
                    <ActionList.LeadingVisual>
                      <DownloadIcon />
                    </ActionList.LeadingVisual>
                    <FormattedMessage defaultMessage="Export review state" />
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={() => stateFileInputRef.current?.click()}
                  >
                    <ActionList.LeadingVisual>
                      <UploadIcon />
                    </ActionList.LeadingVisual>
                    <FormattedMessage defaultMessage="Import review state" />
                  </ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item
                    variant="danger"
                    onSelect={() => void resetState()}
                  >
                    <ActionList.LeadingVisual>
                      <UndoIcon />
                    </ActionList.LeadingVisual>
                    <FormattedMessage defaultMessage="Reset review state" />
                  </ActionList.Item>
                  {shareBookmark ? (
                    <ActionList.Item
                      variant="danger"
                      onSelect={() => void leaveSharedReview()}
                    >
                      <ActionList.LeadingVisual>
                        {shareBookmark.ownerSecret === null ? (
                          <SignOutIcon />
                        ) : (
                          <TrashIcon />
                        )}
                      </ActionList.LeadingVisual>
                      {shareBookmark.ownerSecret === null ? (
                        <FormattedMessage defaultMessage="Leave the review" />
                      ) : (
                        <FormattedMessage defaultMessage="Stop sharing" />
                      )}
                    </ActionList.Item>
                  ) : (
                    // The example review isn't stored.
                    reviewView.reviewAddress.kind === "local" &&
                    reviewView.reviewAddress.reviewId !== exampleReviewId && (
                      <ActionList.Item
                        variant="danger"
                        onSelect={() => void deleteLoadedReview()}
                      >
                        <ActionList.LeadingVisual>
                          <TrashIcon />
                        </ActionList.LeadingVisual>
                        <FormattedMessage defaultMessage="Delete review" />
                      </ActionList.Item>
                    )
                  )}
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </div>
        </div>
      </div>
      {isShareDialogOpen &&
        (shareBookmark ? (
          <ShareLinkDialog
            shareBookmark={shareBookmark}
            onClose={() => setIsShareDialogOpen(false)}
          />
        ) : (
          <ShareReviewDialog
            loadedReview={loadedReview}
            viewedFingerprints={reviewState.viewedFingerprints}
            onClose={() => setIsShareDialogOpen(false)}
          />
        ))}
      <HiddenFileInput
        ref={stateFileInputRef}
        accept="application/json"
        onChange={(file) => void importState(file)}
      />
    </section>
  );
}
