import {
  DatabaseIcon,
  DownloadIcon,
  UndoIcon,
  UploadIcon,
} from "@primer/octicons-react";
import { ActionList, ActionMenu, IconButton, useConfirm } from "@primer/react";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import baseFileName from "../../../business-logic/files/baseFileName.ts";
import downloadFile from "../../../business-logic/files/downloadFile.ts";
import parseReviewState from "../../../business-logic/review-state/parseReviewState.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import HiddenFileInput from "../../design-system/HiddenFileInput/HiddenFileInput.tsx";
import CollaborationSessionButton from "../CollaborationSessionButton/CollaborationSessionButton.tsx";
import styles from "./ReviewActions.module.css";

interface Props {
  loadedReview: LoadedReview;
}

/**
 * The collaboration session's button, and the menu of the review state's
 * actions.
 */
export default function ReviewActions({ loadedReview }: Props) {
  const intl = useIntl();
  const confirm = useConfirm();
  const { reviewState, dispatch } = useReviewState();
  const stateFileInputRef = useRef<HTMLInputElement>(null);
  const isInSession = useSessionConnectionContext() !== null;
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
      content: isInSession
        ? intl.formatMessage({
            defaultMessage:
              "Every file will be marked as not viewed, for every participant.",
          })
        : intl.formatMessage({
            defaultMessage: "Every file will be marked as not viewed.",
          }),
      confirmButtonContent: intl.formatMessage({ defaultMessage: "Reset" }),
      confirmButtonType: "danger",
    });
    if (isConfirmed) {
      dispatch({ type: "resetViewed" });
    }
  };
  return (
    <div className={styles["actions"]}>
      <CollaborationSessionButton orientation="horizontal" />
      <ActionMenu>
        <ActionMenu.Anchor>
          <IconButton
            tooltipDirection="n"
            variant="invisible"
            size="small"
            icon={DatabaseIcon}
            aria-label={intl.formatMessage({
              defaultMessage: "Review state",
            })}
          />
        </ActionMenu.Anchor>
        {/* The sidebar sticks while the page scrolls: placed by the
            document, the menu would open below the viewport. */}
        <ActionMenu.Overlay displayInViewport>
          <ActionList>
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
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
      <HiddenFileInput
        ref={stateFileInputRef}
        accept="application/json"
        onChange={(file) => void importState(file)}
      />
    </div>
  );
}
