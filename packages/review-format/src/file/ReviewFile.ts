import type ReviewData from "../data/types/ReviewData.ts";
import type FileDiff from "../diff/FileDiff.ts";

export default interface ReviewFile {
  data: ReviewData;
  /** The whole PR, from the base commit to the head commit. */
  diff: FileDiff[];
}
