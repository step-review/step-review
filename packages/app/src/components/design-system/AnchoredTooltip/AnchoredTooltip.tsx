import { useAnchoredPosition } from "@primer/react";
import { useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import styles from "./AnchoredTooltip.module.css";

interface Props {
  /** The element the tooltip points at. */
  anchorRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  text: string;
}

/**
 * A tooltip styled like Primer's, opened and closed by its owner. Primer's own
 * opens on any hover of an interactive trigger, so it can't show only for
 * cut-off text, or for an element inside a link or tree item.
 */
export default function AnchoredTooltip({ anchorRef, isOpen, text }: Props) {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  // Before positioning, which measures the open tooltip.
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) {
      return;
    }
    if (isOpen) {
      tooltip.showPopover();
    } else if (tooltip.matches(":popover-open")) {
      tooltip.hidePopover();
    }
  }, [isOpen]);
  const { position } = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: tooltipRef,
      side: "outside-bottom",
      align: "start",
      anchorOffset: 4,
      enabled: isOpen,
    },
    [isOpen, text],
  );
  return (
    // Hidden from assistive technology: the full text is already in the page.
    <span
      ref={tooltipRef}
      popover="manual"
      aria-hidden
      className={styles["tooltip"]}
      style={{ top: position?.top, left: position?.left }}
    >
      {text}
    </span>
  );
}
