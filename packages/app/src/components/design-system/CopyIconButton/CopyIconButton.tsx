import { ActionIcon, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { FormattedMessage } from "react-intl";

interface Props {
  value: string;
  label: string;
  size?: "sm" | "lg";
  variant?: "subtle" | "default";
}

export default function CopyIconButton({
  value,
  label,
  size = "sm",
  variant = "subtle",
}: Props) {
  const iconSize = size === "lg" ? 18 : 14;
  return (
    <CopyButton value={value} timeout={1500}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? <FormattedMessage defaultMessage="Copied" /> : label}
          withArrow
        >
          <ActionIcon
            variant={variant}
            color={copied ? "teal" : "gray"}
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
