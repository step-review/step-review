import { useLiveQuery } from "dexie-react-hooks";
import reviewDatabase from "../review-store/reviewDatabase.ts";
import type ShareBookmark from "./ShareBookmark.ts";

/**
 * The shares opened in this browser, most recently opened first; `undefined`
 * while they are read.
 */
export default function useShareBookmarks(): ShareBookmark[] | undefined {
  return useLiveQuery(
    () => reviewDatabase.shareBookmarks.orderBy("openedAt").reverse().toArray(),
    [],
  );
}
