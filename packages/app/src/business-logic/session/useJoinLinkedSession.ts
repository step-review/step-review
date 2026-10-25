import { useEffect, useState } from "react";
import type SessionBookmark from "../session-store/SessionBookmark.ts";
import joinSession from "./joinSession.ts";
import loadLinkedReview from "./loadLinkedReview.ts";

/**
 * Joins the session a link opens, unless its bookmark already holds the link's
 * key: whether the link can't open it.
 */
export default function useJoinLinkedSession(
  sessionId: string,
  linkSessionKey: string | null,
  sessionBookmark: SessionBookmark | null | undefined,
): boolean {
  /** Set when the link's key can't open the session. */
  const [unusableSessionKey, setUnusableSessionKey] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (
      sessionBookmark === undefined ||
      linkSessionKey === null ||
      sessionBookmark?.sessionKey === linkSessionKey
    ) {
      return;
    }
    // Joined only once the review opens, so that a link to a deleted session,
    // or cut short, neither leaves a bookmark nor replaces a working key.
    let isCurrent = true;
    void loadLinkedReview(window.location.origin, sessionId, linkSessionKey)
      .catch(() => null)
      .then(async (linkedReview) => {
        if (!isCurrent) {
          return;
        }
        if (linkedReview) {
          await joinSession(
            sessionId,
            linkSessionKey,
            linkedReview.reviewFile.data.target.title,
            sessionBookmark,
          );
        } else {
          setUnusableSessionKey(linkSessionKey);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [sessionId, linkSessionKey, sessionBookmark]);
  return linkSessionKey !== null && linkSessionKey === unusableSessionKey;
}
