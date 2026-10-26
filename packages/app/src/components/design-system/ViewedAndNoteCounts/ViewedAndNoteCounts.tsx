import { FormattedMessage } from "react-intl";
import type NoteKindCounts from "../../../business-logic/review-view/NoteKindCounts.ts";
import NoteCounts from "../NoteCounts/NoteCounts.tsx";
import styles from "./ViewedAndNoteCounts.module.css";

interface Props {
  viewedCount: number;
  totalCount: number;
  noteKindCounts: NoteKindCounts;
}

/**
 * How many files were viewed, and how many issues and plain notes there are,
 * compact for the sidebar.
 */
export default function ViewedAndNoteCounts({
  viewedCount,
  totalCount,
  noteKindCounts,
}: Props) {
  return (
    <span className={styles["counts"]}>
      {/* As wide as with every file viewed, its widest, so that it keeps its
          width as files are viewed. */}
      <span className={styles["viewed"]}>
        <span>
          <FormattedMessage
            defaultMessage="{viewedCount}/{totalCount} viewed"
            values={{ viewedCount, totalCount }}
          />
        </span>
        <span className={styles["widest"]} aria-hidden>
          <FormattedMessage
            defaultMessage="{viewedCount}/{totalCount} viewed"
            values={{ viewedCount: totalCount, totalCount }}
          />
        </span>
      </span>
      <NoteCounts {...noteKindCounts} isCompact />
    </span>
  );
}
