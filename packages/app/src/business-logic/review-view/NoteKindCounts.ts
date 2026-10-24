import type { IssueSeverity } from "@step-review/review-format";

export default interface NoteKindCounts {
  issueCountsBySeverity: Record<IssueSeverity, number>;
  /** Notes that aren't issues, shown as plain notes. */
  explainerCount: number;
}
