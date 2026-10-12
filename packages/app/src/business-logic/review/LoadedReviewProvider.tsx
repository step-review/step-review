/* oxlint-disable architecture/public-exports -- Keep the review context and its hook together. */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type LoadedReview from "./LoadedReview.ts";

interface LoadedReviewContextValue {
  loadedReview: LoadedReview | null;
  setLoadedReview: (loadedReview: LoadedReview | null) => void;
}

const LoadedReviewContext = createContext<LoadedReviewContextValue>({
  loadedReview: null,
  setLoadedReview: () => undefined,
});

interface Props {
  initialLoadedReview?: LoadedReview | null;
  children: ReactNode;
}

export default function LoadedReviewProvider({
  initialLoadedReview = null,
  children,
}: Props) {
  const [loadedReview, setLoadedReview] = useState(initialLoadedReview);
  const value = useMemo(
    () => ({ loadedReview, setLoadedReview }),
    [loadedReview],
  );
  return <LoadedReviewContext value={value}>{children}</LoadedReviewContext>;
}

export function useLoadedReviewContext() {
  return useContext(LoadedReviewContext);
}
