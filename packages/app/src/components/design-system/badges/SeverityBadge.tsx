import { Label } from "@primer/react";
import type { LabelColorOptions } from "@primer/react";
import type { IssueSeverity } from "@step-review/review-format";
import { FormattedMessage } from "react-intl";

interface Props {
  severity: IssueSeverity;
}

const variants: Record<IssueSeverity, LabelColorOptions> = {
  blocker: "danger",
  concern: "attention",
  question: "done",
  nit: "secondary",
};

export default function SeverityBadge({ severity }: Props) {
  return (
    <Label variant={variants[severity]}>
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
