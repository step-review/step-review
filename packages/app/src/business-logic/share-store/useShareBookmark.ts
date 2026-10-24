import { useLiveQuery } from "dexie-react-hooks";
import reviewDatabase from "../review-store/reviewDatabase.ts";
import type ShareBookmark from "./ShareBookmark.ts";

/** `null` when the share isn't bookmarked, `undefined` while it is read. */
export default function useShareBookmark(
  shareId: string,
): ShareBookmark | null | undefined {
  return useLiveQuery(
    async () => (await reviewDatabase.shareBookmarks.get(shareId)) ?? null,
    [shareId],
  );
}
