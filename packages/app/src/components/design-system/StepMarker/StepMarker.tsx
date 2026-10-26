import ViewedProgressRing from "../ViewedProgressRing/ViewedProgressRing.tsx";
import styles from "./StepMarker.module.css";

interface Props {
  /** Shown inside the marker. */
  number: number;
  isActive: boolean;
  /** Fills the ring as the step's files are viewed. */
  progress?: { viewedCount: number; totalCount: number };
}

/** A step's point on a timeline: its number in a ring. */
export default function StepMarker({ number, isActive, progress }: Props) {
  return (
    <span
      className={styles["marker"]}
      data-active={isActive || undefined}
      data-with-progress={progress ? true : undefined}
    >
      {progress && (
        <span className={styles["progress"]}>
          <ViewedProgressRing {...progress} />
        </span>
      )}
      {number}
    </span>
  );
}
