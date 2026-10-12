/* oxlint-disable architecture/public-exports -- Keep the review state context and its hook together. */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { ActionDispatch, ReactNode } from "react";
import readStorage from "../storage/readStorage.ts";
import writeStorage from "../storage/writeStorage.ts";
import emptyReviewState from "./emptyReviewState.ts";
import parseReviewState from "./parseReviewState.ts";
import reduceReviewState from "./reduceReviewState.ts";
import type ReviewState from "./ReviewState.ts";
import type ReviewStateAction from "./ReviewStateAction.ts";

interface ReviewStateContextValue {
  reviewState: ReviewState;
  dispatch: ActionDispatch<[action: ReviewStateAction]>;
}

const ReviewStateContext = createContext<ReviewStateContextValue>({
  reviewState: emptyReviewState(),
  dispatch: () => undefined,
});

interface Props {
  storageKey: string;
  children: ReactNode;
}

/** Keeps the reviewer's state for one review, persisted in local storage. */
export default function ReviewStateProvider({ storageKey, children }: Props) {
  const storageItemKey = `step-review:review:${storageKey}`;
  const [reviewState, dispatch] = useReducer(
    reduceReviewState,
    storageItemKey,
    (key) => parseReviewState(readStorage(key)) ?? emptyReviewState(),
  );
  useEffect(() => {
    writeStorage(storageItemKey, JSON.stringify(reviewState));
  }, [storageItemKey, reviewState]);
  const value = useMemo(() => ({ reviewState, dispatch }), [reviewState]);
  return <ReviewStateContext value={value}>{children}</ReviewStateContext>;
}

export function useReviewState() {
  return useContext(ReviewStateContext);
}
