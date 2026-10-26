import reviewDatabase from "../review-store/reviewDatabase.ts";

/** Forgets a session in this browser; it stays on the server for the others. */
export default async function deleteSessionBookmark(
  sessionId: string,
): Promise<void> {
  await reviewDatabase.sessionBookmarks.delete(sessionId);
}
