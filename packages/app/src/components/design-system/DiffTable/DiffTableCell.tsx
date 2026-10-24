import type { ReactNode } from "react";
import styles from "./DiffTable.module.css";

interface Props {
  kind: "number" | "code" | "full";
  tone?: "context" | "addition" | "deletion" | "empty" | "hunk" | "gap";
  colSpan?: number;
  title?: string;
  children?: ReactNode;
}

export default function DiffTableCell({
  kind,
  tone = "context",
  colSpan,
  title,
  children,
}: Props) {
  return (
    <td
      className={styles["cell"]}
      data-kind={kind}
      data-tone={tone}
      colSpan={colSpan}
      title={title}
    >
      {children}
    </td>
  );
}
