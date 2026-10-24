import { useRef, useState } from "react";
import type { ReactNode } from "react";
import AnchoredTooltip from "../AnchoredTooltip/AnchoredTooltip.tsx";
import styles from "./TruncatedText.module.css";

interface Props {
  /** Shown right away on hover, but only while the text is cut off. */
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
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  return (
    <>
      <span
        ref={textRef}
        className={styles["text"]}
        data-truncate-from={truncateFrom}
        onMouseEnter={(event) =>
          setIsTooltipOpen(
            event.currentTarget.scrollWidth > event.currentTarget.clientWidth,
          )
        }
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        {/* Keeps the text left to right when the start is cut off. */}
        <span dir="ltr">{children}</span>
      </span>
      <AnchoredTooltip
        anchorRef={textRef}
        isOpen={isTooltipOpen}
        text={tooltip}
      />
    </>
  );
}
