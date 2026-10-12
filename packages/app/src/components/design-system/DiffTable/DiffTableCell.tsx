import type { ReactNode } from "react";
import styles from "./DiffTable.module.css";

interface Props {
  kind: "number" | "code" | "full";
  tone?: "context" | "addition" | "deletion" | "empty" | "hunk" | "gap";
  colSpan?: number;
  title?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export default function DiffTableCell({
  kind,
  tone = "context",
  colSpan,
  title,
  onClick,
  children,
}: Props) {
  return (
    <td
      className={styles["cell"]}
      data-kind={kind}
      data-tone={tone}
      data-clickable={onClick ? true : undefined}
      colSpan={colSpan}
      title={title}
      onClick={onClick}
    >
      {children}
    </td>
  );
}
