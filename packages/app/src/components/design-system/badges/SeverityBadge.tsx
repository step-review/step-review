import { Label } from "@primer/react";
import type { IssueSeverity } from "@step-review/review-format";
import { FormattedMessage } from "react-intl";
import severityLabelVariants from "./severityLabelVariants.ts";

interface Props {
  severity: IssueSeverity;
}

export default function SeverityBadge({ severity }: Props) {
  return (
    <Label variant={severityLabelVariants[severity]}>
      {severity === "blocker" ? (
        <FormattedMessage defaultMessage="Blocker" />
      ) : severity === "concern" ? (
        <FormattedMessage defaultMessage="Concern" />
      ) : severity === "question" ? (
        <FormattedMessage defaultMessage="Question" />
      ) : (
        <FormattedMessage defaultMessage="Nit" />
      )}
    </Label>
  );
}
