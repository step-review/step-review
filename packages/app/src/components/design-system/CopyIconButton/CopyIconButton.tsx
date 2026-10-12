import { ActionIcon, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { FormattedMessage } from "react-intl";

interface Props {
  value: string;
  label: string;
}

export default function CopyIconButton({ value, label }: Props) {
  return (
    <CopyButton value={value} timeout={1500}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? <FormattedMessage defaultMessage="Copied" /> : label}
          withArrow
        >
          <ActionIcon
            variant="subtle"
            color={copied ? "teal" : "gray"}
            size="sm"
            onClick={copy}
            aria-label={label}
          >
            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}
