import readStorage from "../storage/readStorage.ts";
import addedReviewStorageKey from "./addedReviewStorageKey.ts";

/** Whether a review was ever opened or a session joined in this browser. */
export default function hasAddedReview(): boolean {
  return readStorage(addedReviewStorageKey) !== null;
}
