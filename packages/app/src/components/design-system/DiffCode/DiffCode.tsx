import type { CSSProperties } from "react";
import type LineSegment from "../../../business-logic/diff-layout/LineSegment.ts";
import styles from "./DiffCode.module.css";

interface Props {
  segments: LineSegment[];
  tone: "context" | "addition" | "deletion";
}

/** The code of a diff line, with syntax colors and changed words. */
export default function DiffCode({ segments, tone }: Props) {
  return (
    <span className={styles["code"]}>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={styles["segment"]}
          data-changed={segment.changed ? tone : undefined}
          style={
            {
              "--light-color": segment.color ?? undefined,
              "--dark-color": segment.darkColor ?? undefined,
            } as CSSProperties
          }
        >
          {segment.text}
        </span>
      ))}
      {segments.length === 0 && " "}
    </span>
  );
}
