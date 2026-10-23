import { Text, Tooltip } from "@mantine/core";
import type { MantineColor, MantineSize } from "@mantine/core";
import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./TruncatedText.module.css";

interface Props {
  /** Shown right away on hover, but only while the text is cut off. */
  tooltip: string;
  /** Which end is cut off; `start` keeps the end of a path visible. */
  truncateFrom?: "start" | "end";
  size?: MantineSize;
  c?: MantineColor;
  ff?: "monospace" | "text";
  /** Turns kerning off, so file names keep every character visible. */
  isUnkerned?: boolean;
  children: ReactNode;
}

/** One line of text, cut off with an ellipsis when it doesn't fit. */
export default function TruncatedText({
  tooltip,
  truncateFrom = "end",
  size,
  c,
  ff,
  isUnkerned = false,
  children,
}: Props) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  return (
    <Tooltip label={tooltip} opened={isTooltipOpen}>
      <Text
        size={size}
        c={c}
        ff={ff}
        className={styles["text"]}
        data-truncate-from={truncateFrom}
        data-unkerned={isUnkerned || undefined}
        onMouseEnter={(event) =>
          setIsTooltipOpen(
            event.currentTarget.scrollWidth > event.currentTarget.clientWidth,
          )
        }
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        {/* Keeps the text left to right when the start is cut off. */}
        <span dir="ltr">{children}</span>
      </Text>
    </Tooltip>
  );
}
