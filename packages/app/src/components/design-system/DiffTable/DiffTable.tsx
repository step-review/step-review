import type { ReactNode } from "react";
import styles from "./DiffTable.module.css";

interface Props {
  layout: "unified" | "split";
  children: ReactNode;
}

/** Table of diff lines. Use `DiffTableRow` and `DiffTableCell` inside. */
export default function DiffTable({ layout, children }: Props) {
  return (
    <table className={styles["table"]}>
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
