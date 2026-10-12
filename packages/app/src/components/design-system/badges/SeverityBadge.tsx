import { Badge } from "@mantine/core";
import type { IssueSeverity } from "@step-review/review-format";
import { FormattedMessage } from "react-intl";

interface Props {
  severity: IssueSeverity;
}

const colors: Record<IssueSeverity, string> = {
  blocker: "red",
  concern: "orange",
  question: "violet",
  nit: "gray",
};

export default function SeverityBadge({ severity }: Props) {
  return (
    <Badge
      miw="max-content"
      color={colors[severity]}
      variant="filled"
      size="xs"
      radius="sm"
    >
      {severity === "blocker" ? (
        <FormattedMessage defaultMessage="Blocker" />
      ) : severity === "concern" ? (
        <FormattedMessage defaultMessage="Concern" />
      ) : severity === "question" ? (
        <FormattedMessage defaultMessage="Question" />
      ) : (
        <FormattedMessage defaultMessage="Nit" />
      )}
    </Badge>
  );
}
