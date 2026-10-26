import styles from "./ViewedProgressRing.module.css";

interface Props {
  viewedCount: number;
  totalCount: number;
}

/**
 * How many files were viewed, as a ring filling clockwise from the top, green
 * once all were. It fills its container.
 */
export default function ViewedProgressRing({ viewedCount, totalCount }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles["ring"]}
      data-complete={viewedCount === totalCount || undefined}
      aria-hidden
    >
      {/* As thin as a border, at the ring's outer edge. */}
      <circle className={styles["track"]} cx="12" cy="12" r="11.5" />
      <circle
        className={styles["progress"]}
        cx="12"
        cy="12"
        r="11"
        pathLength={100}
        strokeDasharray={`${(viewedCount / Math.max(totalCount, 1)) * 100} 100`}
      />
    </svg>
  );
}
