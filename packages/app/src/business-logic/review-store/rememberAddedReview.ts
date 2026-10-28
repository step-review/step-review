import writeStorage from "../storage/writeStorage.ts";
import addedReviewStorageKey from "./addedReviewStorageKey.ts";

export default function rememberAddedReview(): void {
  writeStorage(addedReviewStorageKey, "true");
}
