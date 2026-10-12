import type { DiffLine } from "@step-review/review-format";
import type { ReactNode } from "react";
import type LineSegment from "../../../business-logic/diff-layout/LineSegment.ts";

/** What the diff rows need from `DiffView` to render lines. */
export default interface DiffRowRenderer {
  getSegments: (line: DiffLine) => LineSegment[];
  isHighlighted: (lineKeys: string[]) => boolean;
  onRowHoverChange: (lineKeys: string[], isHovered: boolean) => void;
  onLineNumberClick: (line: DiffLine, side: "old" | "new") => void;
  /** Notes and comments shown below the row, if any. */
  renderExtras: (lineKeys: string[], colSpan: number) => ReactNode;
  onExpandGap: (gapId: string) => void;
}
