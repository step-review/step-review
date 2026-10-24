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
      <span className={styles["viewed"]}>
        <FormattedMessage
          defaultMessage="{viewedCount}/{totalCount} viewed"
          values={{ viewedCount, totalCount }}
        />
      </span>
      <NoteCounts {...noteKindCounts} isCompact />
    </span>
  );
}
