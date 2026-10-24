import { Label } from "@primer/react";
import type { Attention } from "@step-review/review-format";
import { FormattedMessage } from "react-intl";

interface Props {
  attention: Attention;
}

/** Shows how much attention a step needs; nothing for `normal`. */
export default function AttentionBadge({ attention }: Props) {
  if (attention === "normal") {
    return null;
  }
  return attention === "high" ? (
    <Label variant="attention">
      <FormattedMessage defaultMessage="Read carefully" />
    </Label>
  ) : (
    <Label variant="secondary">
      <FormattedMessage defaultMessage="Skim" />
    </Label>
  );
}
