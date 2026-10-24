import type { FileDiff, FileNote, Hunk } from "@step-review/review-format";

export default interface StepFileView {
  /** Unique within the review; used for DOM IDs. */
  id: string;
  path: string;
  fileDiff: FileDiff;
  /** The hunks this step shows. */
  hunks: Hunk[];
  additions: number;
  deletions: number;
  summary: string | null;
  notes: FileNote[];
  /** Identifies the shown changes, for the viewed state. */
  fingerprint: string;
}
