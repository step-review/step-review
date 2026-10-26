import { useLiveQuery } from "dexie-react-hooks";
import reviewDatabase from "../review-store/reviewDatabase.ts";
import type SessionBookmark from "./SessionBookmark.ts";

/**
 * The sessions opened in this browser, most recently opened first; `undefined`
 * while they are read.
 */
export default function useSessionBookmarks(): SessionBookmark[] | undefined {
  return useLiveQuery(
    () =>
      reviewDatabase.sessionBookmarks.orderBy("openedAt").reverse().toArray(),
    [],
  );
}
