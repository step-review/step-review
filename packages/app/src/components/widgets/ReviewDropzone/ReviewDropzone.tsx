import {
  Alert,
  Button,
  FileButton,
  Group,
  List,
  Stack,
  Text,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconAlertTriangle, IconFileUpload } from "@tabler/icons-react";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";

/**
 * Opens a review file chosen with the button or dropped anywhere on the page,
 * and shows why it can't be opened if it's not a valid review.
 */
export default function ReviewDropzone() {
  const intl = useIntl();
  const { openReviewFile, problems } = useOpenReviewFile();
  const resetFileButtonRef = useRef<() => void>(null);
  const problemsText = problems
    .map((problem) =>
      problem.location
        ? `${problem.location}: ${problem.message}`
        : problem.message,
    )
    .join("\n");
  return (
    <Stack gap="sm">
      <Group gap="sm">
        <FileButton
          resetRef={resetFileButtonRef}
          onChange={(file) => {
            // Lets the user choose the same file again, e.g. after fixing it.
            resetFileButtonRef.current?.();
            if (file) {
              void openReviewFile(file);
            }
          }}
        >
          {(props) => (
            <Button
              {...props}
              variant="default"
              leftSection={<IconFileUpload size={16} />}
            >
              <FormattedMessage defaultMessage="Open file" />
            </Button>
          )}
        </FileButton>
        <Text c="dimmed">
          <FormattedMessage defaultMessage="or drop it anywhere here" />
        </Text>
      </Group>
      <Dropzone.FullScreen
        multiple={false}
        onDrop={(files) => {
          const file = files[0];
          if (file) {
            void openReviewFile(file);
          }
        }}
      >
        <Group justify="center" mih="60vh" style={{ pointerEvents: "none" }}>
          <IconFileUpload size={48} stroke={1.5} />
          <Text size="xl">
            <FormattedMessage defaultMessage="Drop the review file to open it" />
          </Text>
        </Group>
      </Dropzone.FullScreen>
      {problems.length > 0 && (
        <Alert
          color="danger"
          icon={<IconAlertTriangle />}
          title={
            <Group gap="xs">
              <FormattedMessage defaultMessage="The file is not a valid review" />
              <CopyIconButton
                value={problemsText}
                label={intl.formatMessage({
                  defaultMessage: "Copy the problems",
                })}
              />
            </Group>
          }
        >
          <List size="sm" spacing={4}>
            {problems.map((problem, index) => (
              <List.Item key={index}>
                {problem.location && (
                  <Text span ff="monospace" size="sm">
                    {problem.location}:{" "}
                  </Text>
                )}
                {problem.message}
              </List.Item>
            ))}
          </List>
        </Alert>
      )}
    </Stack>
  );
}
