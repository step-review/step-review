import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface Props {
  initialBody?: string;
  onSave: (body: string) => void;
  onCancel: () => void;
}

export default function CommentEditor({
  initialBody = "",
  onSave,
  onCancel,
}: Props) {
  const intl = useIntl();
  const [body, setBody] = useState(initialBody);
  return (
    <Stack gap={6}>
      <Textarea
        autoFocus
        autosize
        minRows={2}
        size="xs"
        placeholder={intl.formatMessage({
          defaultMessage: "Your comment, for the agent",
        })}
        value={body}
        onChange={(event) => setBody(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            (event.metaKey || event.ctrlKey) &&
            body.trim()
          ) {
            onSave(body.trim());
          }
          if (event.key === "Escape") {
            onCancel();
          }
        }}
      />
      <Group gap={6} justify="flex-end">
        <Button size="compact-xs" variant="subtle" onClick={onCancel}>
          <FormattedMessage defaultMessage="Cancel" />
        </Button>
        <Button
          size="compact-xs"
          disabled={!body.trim()}
          onClick={() => onSave(body.trim())}
        >
          <FormattedMessage defaultMessage="Save comment" />
        </Button>
      </Group>
    </Stack>
  );
}
