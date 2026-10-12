import { ActionIcon, FileButton, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDots,
  IconDownload,
  IconEyeOff,
  IconFileImport,
  IconFolderOpen,
  IconPrompt,
} from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import baseFileName from "../../../business-logic/files/baseFileName.ts";
import downloadFile from "../../../business-logic/files/downloadFile.ts";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import parseReviewState from "../../../business-logic/review-state/parseReviewState.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import NextRoundModal from "../NextRoundModal/NextRoundModal.tsx";

interface Props {
  loadedReview: LoadedReview;
}

export default function ReviewMenu({ loadedReview }: Props) {
  const intl = useIntl();
  const { reviewState, dispatch } = useReviewState();
  const [isNextRoundOpen, nextRound] = useDisclosure(false);
  const importState = async (file: File | null) => {
    if (!file) {
      return;
    }
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
      <Menu position="bottom-end" width={260}>
        <Menu.Target>
          <ActionIcon
            variant="default"
            aria-label={intl.formatMessage({ defaultMessage: "More actions" })}
          >
            <IconDots size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconPrompt size={14} />}
            onClick={nextRound.open}
          >
            <FormattedMessage defaultMessage="Prompt for the next round" />
          </Menu.Item>
          <Menu.Item
            leftSection={<IconFolderOpen size={14} />}
            onClick={() => navigateTo({ name: RouteName.Start })}
          >
            <FormattedMessage defaultMessage="Open another review" />
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconDownload size={14} />}
            onClick={() =>
              downloadFile(
                `${baseFileName(loadedReview.fileName)}.state.json`,
                JSON.stringify(reviewState, null, 2),
                "application/json",
              )
            }
          >
            <FormattedMessage defaultMessage="Export viewed files and feedback" />
          </Menu.Item>
          <FileButton
            onChange={(file) => void importState(file)}
            accept="application/json"
          >
            {(props) => (
              <Menu.Item leftSection={<IconFileImport size={14} />} {...props}>
                <FormattedMessage defaultMessage="Import viewed files and feedback" />
              </Menu.Item>
            )}
          </FileButton>
          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={<IconEyeOff size={14} />}
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
          >
            <FormattedMessage defaultMessage="Reset viewed files" />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <NextRoundModal
        loadedReview={loadedReview}
        opened={isNextRoundOpen}
        onClose={nextRound.close}
      />
    </>
  );
}
