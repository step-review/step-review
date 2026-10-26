import randomBase64Url from "../session-crypto/randomBase64Url.ts";
import saveSessionBookmark from "../session-store/saveSessionBookmark.ts";
import type SessionBookmark from "../session-store/SessionBookmark.ts";
import updateSessionBookmark from "../session-store/updateSessionBookmark.ts";

/**
 * Bookmarks a session opened from a link, as a new participant. A session
 * already bookmarked takes the link's key, keeping its participant.
 */
export default async function joinSession(
  sessionId: string,
  sessionKey: string,
  title: string,
  sessionBookmark: SessionBookmark | null,
): Promise<void> {
  if (sessionBookmark) {
    await updateSessionBookmark(sessionId, { sessionKey, title });
    return;
  }
  await saveSessionBookmark({
    sessionId,
    sessionKey,
    title,
    openedAt: Date.now(),
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
    ownerSecret: null,
  });
}
