import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./TruncatedText.module.css";

interface Props {
  /** Shown on hover, but only while the text is cut off. */
  tooltip: string;
  /** Which end is cut off; `start` keeps the end of a path visible. */
  truncateFrom?: "start" | "end";
  children: ReactNode;
}

/**
 * One line of text in the surrounding font, cut off with an ellipsis when it
 * doesn't fit.
 */
export default function TruncatedText({
  tooltip,
  truncateFrom = "end",
  children,
}: Props) {
  const [isTruncated, setIsTruncated] = useState(false);
  return (
    // Primer's tooltips are for interactive elements, so this uses `title`.
    <span
      className={styles["text"]}
      data-truncate-from={truncateFrom}
      title={isTruncated ? tooltip : undefined}
      onMouseEnter={(event) =>
        setIsTruncated(
          event.currentTarget.scrollWidth > event.currentTarget.clientWidth,
        )
      }
    >
      {/* Keeps the text left to right when the start is cut off. */}
      <span dir="ltr">{children}</span>
    </span>
  );
}
