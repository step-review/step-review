import {
  Button,
  Code,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import exportFeedbackMarkdown from "../../../business-logic/feedback/exportFeedbackMarkdown.ts";
import baseFileName from "../../../business-logic/files/baseFileName.ts";
import downloadFile from "../../../business-logic/files/downloadFile.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import useNoteIndex from "../../../business-logic/rounds/useNoteIndex.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";

interface Props {
  loadedReview: LoadedReview;
  opened: boolean;
  onClose: () => void;
}

/** The reviewer's feedback, ready to hand back to the agent. */
export default function FeedbackModal({
  loadedReview,
  opened,
  onClose,
}: Props) {
  const intl = useIntl();
  const { reviewState } = useReviewState();
  const noteIndex = useNoteIndex();
  const markdown = opened
    ? exportFeedbackMarkdown(loadedReview, reviewState, noteIndex)
    : "";
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title={<FormattedMessage defaultMessage="Feedback" />}
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          <FormattedMessage defaultMessage="Your verdicts on the issues and your comments, as Markdown. Paste it into the conversation with your coding agent, or into a PR comment." />
        </Text>
        <ScrollArea.Autosize mah="55vh">
          <Code block style={{ whiteSpace: "pre-wrap" }}>
            {markdown}
          </Code>
        </ScrollArea.Autosize>
        <Group justify="flex-end" gap="xs">
          <CopyIconButton
            value={markdown}
            label={intl.formatMessage({ defaultMessage: "Copy as Markdown" })}
          />
          <Button
            variant="default"
            size="xs"
            leftSection={<IconDownload size={14} />}
            onClick={() =>
              downloadFile(
                `${baseFileName(loadedReview.fileName)}.feedback.md`,
                markdown,
                "text/markdown",
              )
            }
          >
            <FormattedMessage defaultMessage="Download Markdown" />
          </Button>
          <Button
            variant="default"
            size="xs"
            leftSection={<IconDownload size={14} />}
            onClick={() =>
              downloadFile(
                `${baseFileName(loadedReview.fileName)}.feedback.json`,
                JSON.stringify(
                  {
                    reviewFile: loadedReview.fileName,
                    issueVerdicts: reviewState.issueVerdicts,
                    comments: reviewState.comments,
                  },
                  null,
                  2,
                ),
                "application/json",
              )
            }
          >
            <FormattedMessage defaultMessage="Download JSON" />
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
