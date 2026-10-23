import { Text, Tooltip } from "@mantine/core";
import type { MantineColor, MantineSize } from "@mantine/core";
import { useState } from "react";
import type { ReactNode } from "react";

interface Props {
  /** Shown right away on hover, but only while the text is cut off. */
  tooltip: string;
  size?: MantineSize;
  c?: MantineColor;
  children: ReactNode;
}

/** One line of text, cut off with an ellipsis when it doesn't fit. */
export default function TruncatedText({ tooltip, size, c, children }: Props) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  return (
    <Tooltip label={tooltip} opened={isTooltipOpen} withinPortal>
      <Text
        size={size}
        c={c}
        truncate
        onMouseEnter={(event) =>
          setIsTooltipOpen(
            event.currentTarget.scrollWidth > event.currentTarget.clientWidth,
          )
        }
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        {children}
      </Text>
    </Tooltip>
  );
}
