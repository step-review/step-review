import {
  DownloadIcon,
  EyeClosedIcon,
  FileDirectoryOpenFillIcon,
  KebabHorizontalIcon,
  UploadIcon,
} from "@primer/octicons-react";
import { ActionList, ActionMenu, Button } from "@primer/react";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import baseFileName from "../../../business-logic/files/baseFileName.ts";
import downloadFile from "../../../business-logic/files/downloadFile.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import parseReviewState from "../../../business-logic/review-state/parseReviewState.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import HiddenFileInput from "../../design-system/HiddenFileInput/HiddenFileInput.tsx";
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import styles from "./ReviewMenu.module.css";

interface Props {
  loadedReview: LoadedReview;
}

export default function ReviewMenu({ loadedReview }: Props) {
  const intl = useIntl();
  const { reviewState, dispatch } = useReviewState();
  // Outside the menu, which unmounts its items when it closes.
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
    <>
      <HiddenFileInput
        ref={stateFileInputRef}
        accept="application/json"
        onChange={(file) => void importState(file)}
      />
      <ActionMenu>
        <ActionMenu.Anchor>
          <Button
            variant="invisible"
            block
            alignContent="start"
            trailingVisual={KebabHorizontalIcon}
          >
            <span className={styles["fileName"]}>
              <TruncatedText tooltip={loadedReview.fileName}>
                {loadedReview.fileName}
              </TruncatedText>
            </span>
          </Button>
        </ActionMenu.Anchor>
        <ActionMenu.Overlay side="outside-top" width="medium">
          <ActionList>
            <ActionList.Item
              onSelect={() => navigateTo({ name: RouteName.Start })}
            >
              <ActionList.LeadingVisual>
                <FileDirectoryOpenFillIcon />
              </ActionList.LeadingVisual>
              <FormattedMessage defaultMessage="Open another review" />
            </ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item
              onSelect={() =>
                downloadFile(
                  `${baseFileName(loadedReview.fileName)}.state.json`,
                  JSON.stringify(reviewState, null, 2),
                  "application/json",
                )
              }
            >
              <ActionList.LeadingVisual>
                <DownloadIcon />
              </ActionList.LeadingVisual>
              <FormattedMessage defaultMessage="Export viewed files" />
            </ActionList.Item>
            <ActionList.Item
              onSelect={() => stateFileInputRef.current?.click()}
            >
              <ActionList.LeadingVisual>
                <UploadIcon />
              </ActionList.LeadingVisual>
              <FormattedMessage defaultMessage="Import viewed files" />
            </ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item
              variant="danger"
              onSelect={() => {
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
            >
              <ActionList.LeadingVisual>
                <EyeClosedIcon />
              </ActionList.LeadingVisual>
              <FormattedMessage defaultMessage="Reset viewed files" />
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  );
}
