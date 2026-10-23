import { EyeIcon, SkipIcon } from "@primer/octicons-react";
import type { Attention } from "@step-review/review-format";
import { useIntl } from "react-intl";
import styles from "./AttentionIcon.module.css";

interface Props {
  attention: Attention;
}

/** Compact form of `AttentionBadge`: an icon, with the label as tooltip. */
export default function AttentionIcon({ attention }: Props) {
  const intl = useIntl();
  if (attention === "normal") {
    return null;
  }
  const isHigh = attention === "high";
  const label = isHigh
    ? intl.formatMessage({ defaultMessage: "Read carefully" })
    : intl.formatMessage({ defaultMessage: "Skim" });
  const Icon = isHigh ? EyeIcon : SkipIcon;
  return (
    // Primer's tooltips are for interactive elements, so this uses `title`.
    <span className={styles["icon"]} data-attention={attention} title={label}>
      <Icon size={14} aria-label={label} />
    </span>
  );
}
