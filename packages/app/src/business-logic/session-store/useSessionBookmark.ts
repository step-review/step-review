import { useLiveQuery } from "dexie-react-hooks";
import reviewDatabase from "../review-store/reviewDatabase.ts";
import type SessionBookmark from "./SessionBookmark.ts";

/** `null` when the session isn't bookmarked, `undefined` while it is read. */
export default function useSessionBookmark(
  sessionId: string,
): SessionBookmark | null | undefined {
  return useLiveQuery(
    async () => (await reviewDatabase.sessionBookmarks.get(sessionId)) ?? null,
    [sessionId],
  );
}
