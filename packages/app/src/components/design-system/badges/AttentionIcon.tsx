import { EyeIcon, SkipIcon } from "@primer/octicons-react";
import type { Attention } from "@step-review/review-format";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import AnchoredTooltip from "../AnchoredTooltip/AnchoredTooltip.tsx";
import styles from "./AttentionIcon.module.css";

interface Props {
  attention: Attention;
}

/** Compact form of `AttentionBadge`: an icon, with the label as tooltip. */
export default function AttentionIcon({ attention }: Props) {
  const intl = useIntl();
  const iconRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  if (attention === "normal") {
    return null;
  }
  const isHigh = attention === "high";
  const label = isHigh
    ? intl.formatMessage({ defaultMessage: "Read carefully" })
    : intl.formatMessage({ defaultMessage: "Skim" });
  const Icon = isHigh ? EyeIcon : SkipIcon;
  return (
    <>
      <span
        ref={iconRef}
        className={styles["icon"]}
        data-attention={attention}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        <Icon size={14} aria-label={label} />
      </span>
      <AnchoredTooltip
        anchorRef={iconRef}
        isOpen={isTooltipOpen}
        text={label}
      />
    </>
  );
}
