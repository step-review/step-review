import { ActionIcon, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { FormattedMessage } from "react-intl";

interface Props {
  value: string;
  label: string;
  size?: "sm" | "md";
}

export default function CopyIconButton({ value, label, size = "sm" }: Props) {
  const iconSize = size === "md" ? 16 : 14;
  return (
    <CopyButton value={value} timeout={1500}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? <FormattedMessage defaultMessage="Copied" /> : label}
          withArrow
        >
          <ActionIcon
            variant="subtle"
            color={copied ? "success" : "gray"}
            size={size}
            onClick={copy}
            aria-label={label}
          >
            {copied ? (
              <IconCheck size={iconSize} />
            ) : (
              <IconCopy size={iconSize} />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}
