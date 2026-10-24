import reviewDatabase from "../review-store/reviewDatabase.ts";

/** Forgets a share in this browser; it stays on the server for the others. */
export default async function deleteShareBookmark(
  shareId: string,
): Promise<void> {
  await reviewDatabase.shareBookmarks.delete(shareId);
}
