import type { CSSProperties, ReactNode } from "react";
import styles from "./DiffTable.module.css";

interface Props {
  layout: "unified" | "split";
  /** Digits of the largest line number, which sizes the number columns. */
  lineNumberDigitCount: number;
  children: ReactNode;
}

/** Table of diff lines. Use `DiffTableRow` and `DiffTableCell` inside. */
export default function DiffTable({
  layout,
  lineNumberDigitCount,
  children,
}: Props) {
  return (
    <table
      className={styles["table"]}
      style={
        { "--line-number-digit-count": lineNumberDigitCount } as CSSProperties
      }
    >
      <colgroup>
        {layout === "unified" ? (
          <>
            <col className={styles["numberColumn"]} />
            <col className={styles["numberColumn"]} />
            <col />
          </>
        ) : (
          <>
            <col className={styles["numberColumn"]} />
            <col />
            <col className={styles["numberColumn"]} />
            <col />
          </>
        )}
      </colgroup>
      <tbody>{children}</tbody>
    </table>
  );
}
