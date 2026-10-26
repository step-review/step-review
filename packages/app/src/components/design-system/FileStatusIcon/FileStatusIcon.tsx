import {
  DiffAddedIcon,
  DiffModifiedIcon,
  DiffRemovedIcon,
  DiffRenamedIcon,
} from "@primer/octicons-react";
import type { Icon } from "@primer/octicons-react";
import type { FileDiffStatus } from "@step-review/review-format";
import styles from "./FileStatusIcon.module.css";

interface Props {
  status: FileDiffStatus;
}

const icons: Record<FileDiffStatus, Icon> = {
  added: DiffAddedIcon,
  deleted: DiffRemovedIcon,
  modified: DiffModifiedIcon,
  renamed: DiffRenamedIcon,
  // Octicons has no icon for copies, which also come from another path.
  copied: DiffRenamedIcon,
};

/** GitHub's icon for a file's status, without a label of its own. */
export default function FileStatusIcon({ status }: Props) {
  const StatusIcon = icons[status];
  return (
    <StatusIcon aria-hidden className={styles["icon"]} data-status={status} />
  );
}
