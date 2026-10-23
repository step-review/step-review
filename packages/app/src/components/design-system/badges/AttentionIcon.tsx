import { Tooltip } from "@mantine/core";
import type { Attention } from "@step-review/review-format";
import { IconEye, IconPlayerTrackNext } from "@tabler/icons-react";
import { useIntl } from "react-intl";

interface Props {
  attention: Attention;
}

/** Compact form of `AttentionBadge`: an icon, with the label as tooltip. */
export default function AttentionIcon({ attention }: Props) {
  const intl = useIntl();
  if (attention === "normal") {
    return null;
  }
  const isHigh = attention === "high";
  const label = isHigh
    ? intl.formatMessage({ defaultMessage: "Read carefully" })
    : intl.formatMessage({ defaultMessage: "Skim" });
  const Icon = isHigh ? IconEye : IconPlayerTrackNext;
  return (
    <Tooltip label={label} withArrow>
      <Icon
        size={14}
        role="img"
        aria-label={label}
        color={
          isHigh
            ? "var(--mantine-color-attention-filled)"
            : "var(--mantine-color-dimmed)"
        }
      />
    </Tooltip>
  );
}
