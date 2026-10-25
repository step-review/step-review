import reviewDatabase from "../review-store/reviewDatabase.ts";
import type SessionBookmark from "./SessionBookmark.ts";

export default async function updateSessionBookmark(
  sessionId: string,
  changes: Partial<Omit<SessionBookmark, "sessionId">>,
): Promise<void> {
  await reviewDatabase.sessionBookmarks.update(sessionId, changes);
}
