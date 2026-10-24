import { Label } from "@primer/react";
import { FormattedMessage } from "react-intl";
import type NoteKindCounts from "../../../business-logic/review-view/NoteKindCounts.ts";
import styles from "./NoteCounts.module.css";

interface Props extends NoteKindCounts {
  /** Smaller pills, for dense lists. */
  isCompact?: boolean;
}

/** How many issues and plain notes, leaving out the kinds there are none of. */
export default function NoteCounts({
  issueCountsBySeverity,
  explainerCount,
  isCompact = false,
}: Props) {
  const issueCount = Object.values(issueCountsBySeverity).reduce(
    (sum, count) => sum + count,
    0,
  );
  if (issueCount === 0 && explainerCount === 0) {
    return null;
  }
  const labelClassName = isCompact ? styles["compactLabel"] : undefined;
  return (
    <span className={styles["counts"]}>
      {issueCount > 0 && (
        <Label variant="attention" className={labelClassName}>
          <FormattedMessage
            defaultMessage="{issueCount, plural, one {# issue} other {# issues}}"
            values={{ issueCount }}
          />
        </Label>
      )}
      {explainerCount > 0 && (
        <Label className={labelClassName}>
          <FormattedMessage
            defaultMessage="{explainerCount, plural, one {# note} other {# notes}}"
            values={{ explainerCount }}
          />
        </Label>
      )}
    </span>
  );
}
