import { Label } from "@primer/react";
import type { LabelColorOptions } from "@primer/react";
import type { FileDiffStatus } from "@step-review/review-format";
import { useIntl } from "react-intl";
import formatFileStatus from "./formatFileStatus.ts";

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
  const intl = useIntl();
  return (
    <Label variant={variants[status]}>{formatFileStatus(intl, status)}</Label>
  );
}
