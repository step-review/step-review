import rememberAddedReview from "../review-store/rememberAddedReview.ts";
import reviewDatabase from "../review-store/reviewDatabase.ts";
import type SessionBookmark from "./SessionBookmark.ts";

export default async function saveSessionBookmark(
  sessionBookmark: SessionBookmark,
): Promise<void> {
  await reviewDatabase.sessionBookmarks.put(sessionBookmark);
  rememberAddedReview();
}
