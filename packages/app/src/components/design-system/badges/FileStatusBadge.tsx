import { Label } from "@primer/react";
import type { LabelColorOptions } from "@primer/react";
import type { FileDiffStatus } from "@step-review/review-format";
import { FormattedMessage } from "react-intl";

interface Props {
  status: FileDiffStatus;
}

const variants: Record<FileDiffStatus, LabelColorOptions> = {
  added: "success",
  deleted: "danger",
  modified: "secondary",
  renamed: "secondary",
  copied: "secondary",
};

export default function FileStatusBadge({ status }: Props) {
  return (
    <Label variant={variants[status]}>
      {status === "added" ? (
        <FormattedMessage defaultMessage="Added" />
      ) : status === "deleted" ? (
        <FormattedMessage defaultMessage="Deleted" />
      ) : status === "renamed" ? (
        <FormattedMessage defaultMessage="Renamed" />
      ) : status === "copied" ? (
        <FormattedMessage defaultMessage="Copied" />
      ) : (
        <FormattedMessage defaultMessage="Modified" />
      )}
    </Label>
  );
}
