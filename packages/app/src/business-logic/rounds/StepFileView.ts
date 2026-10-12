import type { FileDiff, FileNote, Hunk } from "@step-review/review-format";
import type FileChange from "./FileChange.ts";

export default interface StepFileView {
  /** Unique within the round; used for DOM IDs. */
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
  change: FileChange;
  /** Changes since the previous round, when the round has an interdiff. */
  interdiffHunks: Hunk[] | null;
}
