import { Badge } from "@mantine/core";
import type { Attention } from "@step-review/review-format";
import { FormattedMessage } from "react-intl";

interface Props {
  attention: Attention;
  size?: "xs" | "sm";
}

/** Shows how much attention a step needs; nothing for `normal`. */
export default function AttentionBadge({ attention, size = "sm" }: Props) {
  if (attention === "normal") {
    return null;
  }
  return attention === "high" ? (
    <Badge
      miw="max-content"
      color="orange"
      variant="light"
      size={size}
      radius="sm"
    >
      <FormattedMessage defaultMessage="Read carefully" />
    </Badge>
  ) : (
    <Badge
      miw="max-content"
      color="gray"
      variant="light"
      size={size}
      radius="sm"
    >
      <FormattedMessage defaultMessage="Skim" />
    </Badge>
  );
}
