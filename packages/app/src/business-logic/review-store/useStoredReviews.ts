import { useLiveQuery } from "dexie-react-hooks";
import reviewDatabase from "./reviewDatabase.ts";
import type StoredReview from "./StoredReview.ts";

/**
 * The reviews kept in the browser, most recently opened first; `undefined`
 * while they are read.
 */
export default function useStoredReviews(): StoredReview[] | undefined {
  return useLiveQuery(
    () => reviewDatabase.reviews.orderBy("openedAt").reverse().toArray(),
    [],
  );
}
