import {
  FileAddedIcon,
  FileMovedIcon,
  FileRemovedIcon,
} from "@primer/octicons-react";
import type { FileDiffStatus } from "@step-review/review-format";
import type { ComponentProps, ComponentType } from "react";
import styles from "./FileStatusIcon.module.css";

interface Props {
  status: FileDiffStatus;
}

type StatusIconProps = Pick<ComponentProps<"svg">, "className" | "aria-hidden">;

const icons: Record<FileDiffStatus, ComponentType<StatusIconProps>> = {
  added: FileAddedIcon,
  deleted: FileRemovedIcon,
  modified: FileModifiedIcon,
  renamed: FileMovedIcon,
  // Octicons has no icon for copies, which also come from another path.
  copied: FileMovedIcon,
};

/** GitHub's icon for a file's status, without a label of its own. */
export default function FileStatusIcon({ status }: Props) {
  const StatusIcon = icons[status];
  return (
    <StatusIcon aria-hidden className={styles["icon"]} data-status={status} />
  );
}

/**
 * Octicons' `FileDiffIcon`, redrawn on the page of the other file icons, which
 * is 2px narrower than its own. Rendered as Octicons render their icons.
 */
function FileModifiedIcon(props: StatusIconProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 16 16"
      width={16}
      height={16}
      fill="currentColor"
      display="inline-block"
      style={{ verticalAlign: "text-bottom" }}
    >
      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177l-2.914-2.914a.25.25 0 0 0-.177-.073ZM8 3.25a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0V7h-1.5a.75.75 0 0 1 0-1.5h1.5V4A.75.75 0 0 1 8 3.25Zm-3 8a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
    </svg>
  );
}
