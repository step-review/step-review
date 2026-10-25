import styles from "./StepMarker.module.css";

interface Props {
  /** Shown inside the marker. */
  number: number;
  isActive: boolean;
}

/** A step's point on a timeline: its number in a ring. */
export default function StepMarker({ number, isActive }: Props) {
  return (
    <span className={styles["marker"]} data-active={isActive || undefined}>
      {number}
    </span>
  );
}
