import { Badge } from "@mantine/core";
import type { FileDiffStatus } from "@step-review/review-format";
import { FormattedMessage } from "react-intl";

interface Props {
  status: FileDiffStatus;
}

const colors: Record<FileDiffStatus, string> = {
  added: "addition",
  deleted: "removal",
  modified: "gray",
  renamed: "gray",
  copied: "gray",
};

export default function FileStatusBadge({ status }: Props) {
  return (
    <Badge miw="max-content" color={colors[status]} variant="light" size="sm">
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
    </Badge>
  );
}
