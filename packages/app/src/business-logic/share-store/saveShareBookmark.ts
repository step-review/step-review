import reviewDatabase from "../review-store/reviewDatabase.ts";
import type ShareBookmark from "./ShareBookmark.ts";

export default async function saveShareBookmark(
  shareBookmark: ShareBookmark,
): Promise<void> {
  await reviewDatabase.shareBookmarks.put(shareBookmark);
}
