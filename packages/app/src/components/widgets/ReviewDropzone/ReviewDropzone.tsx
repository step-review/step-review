import { Alert, Group, List, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconAlertTriangle, IconFileUpload } from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";

export default function ReviewDropzone() {
  const intl = useIntl();
  const { openReviewFile, problems, isLoading } = useOpenReviewFile();
  const problemsText = problems
    .map((problem) =>
      problem.location
        ? `${problem.location}: ${problem.message}`
        : problem.message,
    )
    .join("\n");
  return (
    <Stack gap="sm">
      <Dropzone
        multiple={false}
        loading={isLoading}
        onDrop={(files) => {
          const file = files[0];
          if (file) {
            void openReviewFile(file);
          }
        }}
      >
        <Group
          justify="center"
          gap="md"
          mih={120}
          style={{ pointerEvents: "none" }}
        >
          <IconFileUpload size={36} stroke={1.5} />
          <div>
            <Text size="lg">
              <FormattedMessage defaultMessage="Drop the review file here" />
            </Text>
            <Text size="sm" c="dimmed">
              <FormattedMessage defaultMessage="Or click to choose it. The file stays in your browser." />
            </Text>
          </div>
        </Group>
      </Dropzone>
      {problems.length > 0 && (
        <Alert
          color="red"
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
