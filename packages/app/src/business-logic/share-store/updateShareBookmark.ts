import reviewDatabase from "../review-store/reviewDatabase.ts";
import type ShareBookmark from "./ShareBookmark.ts";

export default async function updateShareBookmark(
  shareId: string,
  changes: Partial<Omit<ShareBookmark, "shareId">>,
): Promise<void> {
  await reviewDatabase.shareBookmarks.update(shareId, changes);
}
