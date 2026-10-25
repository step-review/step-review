import deleteSessionBookmark from "../session-store/deleteSessionBookmark.ts";
import type SessionBookmark from "../session-store/SessionBookmark.ts";
import deleteSession from "./deleteSession.ts";

/**
 * Deletes a session from the server, for every participant, and forgets it in
 * this browser.
 */
export default async function endSession(
  apiOrigin: string,
  sessionBookmark: SessionBookmark & { ownerSecret: string },
): Promise<void> {
  await deleteSession(
    apiOrigin,
    sessionBookmark.sessionId,
    sessionBookmark.ownerSecret,
  );
  await deleteSessionBookmark(sessionBookmark.sessionId);
}
