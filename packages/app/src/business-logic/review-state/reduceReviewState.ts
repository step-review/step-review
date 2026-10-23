import type ReviewState from "./ReviewState.ts";
import type ReviewStateAction from "./ReviewStateAction.ts";

export default function reduceReviewState(
  reviewState: ReviewState,
  action: ReviewStateAction,
): ReviewState {
  switch (action.type) {
    case "setViewed": {
      const viewedFingerprints = new Set(reviewState.viewedFingerprints);
      for (const fingerprint of action.fingerprints) {
        if (action.viewed) {
          viewedFingerprints.add(fingerprint);
        } else {
          viewedFingerprints.delete(fingerprint);
        }
      }
      return { ...reviewState, viewedFingerprints: [...viewedFingerprints] };
    }
    case "resetViewed":
      return { ...reviewState, viewedFingerprints: [] };
    case "replace":
      return action.reviewState;
  }
}
