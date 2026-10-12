import { Code, Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import createStartPrompt from "../../../business-logic/prompts/createStartPrompt.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";

export default function PromptGenerator() {
  const intl = useIntl();
  const [target, setTarget] = useState("");
  const [focus, setFocus] = useState("");
  const prompt = target.trim()
    ? createStartPrompt({ target, focus }, window.location.origin)
    : null;
  return (
    <Stack gap="sm">
      <TextInput
        label={<FormattedMessage defaultMessage="What to review" />}
        description={
          <FormattedMessage defaultMessage="A PR link, a branch, or a commit range such as main..my-feature." />
        }
        placeholder="https://github.com/owner/repo/pull/123"
        value={target}
        onChange={(event) => setTarget(event.currentTarget.value)}
      />
      <Textarea
        label={<FormattedMessage defaultMessage="Focus (optional)" />}
        placeholder={intl.formatMessage({
          defaultMessage: "e.g. error handling and the database migration",
        })}
        autosize
        minRows={1}
        value={focus}
        onChange={(event) => setFocus(event.currentTarget.value)}
      />
      {prompt && (
        <Stack gap={4}>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              <FormattedMessage defaultMessage="Prompt for your coding agent" />
            </Text>
            <CopyIconButton
              value={prompt}
              label={intl.formatMessage({ defaultMessage: "Copy the prompt" })}
            />
          </Group>
          <Code block style={{ whiteSpace: "pre-wrap" }}>
            {prompt}
          </Code>
        </Stack>
      )}
    </Stack>
  );
}
