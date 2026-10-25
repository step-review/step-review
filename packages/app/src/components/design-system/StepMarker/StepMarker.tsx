import styles from "./StepMarker.module.css";

interface Props {
  /** Shown inside the marker. */
  number: number;
  /** Fills the ring; `null` for a marker without progress. */
  progress: { viewedCount: number; totalCount: number } | null;
  isActive: boolean;
}

/**
 * A step's point on a timeline: its number in a ring that fills as its files
 * are viewed, solid once all are.
 */
export default function StepMarker({ number, progress, isActive }: Props) {
  const isComplete =
    progress !== null &&
    progress.totalCount > 0 &&
    progress.viewedCount === progress.totalCount;
  const percentage = progress
    ? (progress.viewedCount / Math.max(progress.totalCount, 1)) * 100
    : 0;
  return (
    <span
      className={styles["marker"]}
      data-active={isActive || undefined}
      data-complete={isComplete || undefined}
    >
      {/* The counts are in the text beside it. */}
      <svg className={styles["ring"]} viewBox="0 0 24 24" aria-hidden>
        <circle className={styles["track"]} cx="12" cy="12" r="10.5" />
        {percentage > 0 && !isComplete && (
          <circle
            className={styles["arc"]}
            cx="12"
            cy="12"
            r="10.5"
            pathLength={100}
            strokeDasharray={`${percentage} 100`}
          />
        )}
      </svg>
      {number}
    </span>
  );
}
