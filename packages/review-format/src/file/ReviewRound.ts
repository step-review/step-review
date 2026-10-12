import type FileDiff from "../diff/FileDiff.ts";
import type ReviewRoundData from "../round/types/ReviewRoundData.ts";

export default interface ReviewRound {
  /** 1-based position of the round in the review file. */
  number: number;
  data: ReviewRoundData;
  /** The whole PR at this round's head. */
  diff: FileDiff[];
  /** Changes since the previous round's head, when the agent included them. */
  interdiff: FileDiff[] | null;
}
