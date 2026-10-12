import type FileDiffStatus from "./FileDiffStatus.ts";
import type Hunk from "./Hunk.ts";

export default interface FileDiff {
  /** The new path, or the old path for a deleted file. */
  path: string;
  /** The path before a rename or copy; `null` otherwise. */
  oldPath: string | null;
  status: FileDiffStatus;
  binary: boolean;
  hunks: Hunk[];
  additions: number;
  deletions: number;
}
