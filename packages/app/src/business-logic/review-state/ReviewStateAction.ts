import type ReviewState from "./ReviewState.ts";

type ReviewStateAction =
  | { type: "setViewed"; fingerprints: string[]; viewed: boolean }
  | { type: "resetViewed" }
  | { type: "replace"; reviewState: ReviewState };

export default ReviewStateAction;
