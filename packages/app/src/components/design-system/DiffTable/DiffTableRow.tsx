import type { ReactNode } from "react";
import styles from "./DiffTable.module.css";

interface Props {
  /** Keys of the lines in the row (e.g. `new:12`), to anchor notes. */
  lineKeys?: string[];
  isHighlighted?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
  children: ReactNode;
}

export default function DiffTableRow({
  lineKeys,
  isHighlighted = false,
  onHoverChange,
  children,
}: Props) {
  return (
    <tr
      className={styles["row"]}
      data-line-keys={lineKeys?.join(" ")}
      data-highlighted={isHighlighted || undefined}
      onMouseEnter={onHoverChange && (() => onHoverChange(true))}
      onMouseLeave={onHoverChange && (() => onHoverChange(false))}
    >
      {children}
    </tr>
  );
}
