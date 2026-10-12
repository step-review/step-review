import { Code, Group, Modal, Stack, Text } from "@mantine/core";
import { FormattedMessage, useIntl } from "react-intl";
import createNextRoundPrompt from "../../../business-logic/prompts/createNextRoundPrompt.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";

interface Props {
  loadedReview: LoadedReview;
  opened: boolean;
  onClose: () => void;
}

export default function NextRoundModal({
  loadedReview,
  opened,
  onClose,
}: Props) {
  const intl = useIntl();
  const latestRound = loadedReview.reviewFile.rounds.at(-1)!;
  const prompt = createNextRoundPrompt(
    loadedReview.fileName,
    latestRound.data.target,
    window.location.origin,
  );
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={<FormattedMessage defaultMessage="Prompt for the next round" />}
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          <FormattedMessage defaultMessage="When the PR changes, ask your agent to add a round to the review file, then drop the file here again." />
        </Text>
        <Group justify="flex-end">
          <CopyIconButton
            value={prompt}
            label={intl.formatMessage({ defaultMessage: "Copy the prompt" })}
          />
        </Group>
        <Code block style={{ whiteSpace: "pre-wrap" }}>
          {prompt}
        </Code>
      </Stack>
    </Modal>
  );
}
