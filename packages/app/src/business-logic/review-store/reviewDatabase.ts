import { Dexie, type EntityTable, type Table } from "dexie";
import type ReviewState from "../review-state/ReviewState.ts";
import type SessionBookmark from "../session-store/SessionBookmark.ts";
import type StoredReview from "./StoredReview.ts";

/**
 * The reviews kept in the browser. Files and states are in their own tables,
 * keyed by review ID, so that listing reviews doesn't read whole files and
 * updating a state doesn't rewrite them. Sessions are only bookmarked: the
 * server holds them.
 */
const reviewDatabase = new Dexie("step-review") as Dexie & {
  reviews: EntityTable<StoredReview, "reviewId">;
  reviewFiles: Table<string, string>;
  reviewStates: Table<ReviewState, string>;
  sessionBookmarks: EntityTable<SessionBookmark, "sessionId">;
};
reviewDatabase.version(3).stores({
  reviews: "reviewId, openedAt",
  reviewFiles: "",
  reviewStates: "",
  sessionBookmarks: "sessionId, openedAt",
});

export default reviewDatabase;
