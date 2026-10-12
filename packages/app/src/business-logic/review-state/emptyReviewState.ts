import type ReviewState from "./ReviewState.ts";

export default function emptyReviewState(): ReviewState {
  return { viewedFingerprints: [], issueVerdicts: {}, comments: [] };
}
