import type { ReactNode } from "react";
import reviewAddressId from "../navigation/reviewAddressId.ts";
import { useLoadedReviewContext } from "../review/LoadedReviewValue.tsx";
import ReviewStateProvider from "./ReviewStateProvider.tsx";

interface Props {
  children: ReactNode;
}

/** Provides the reviewer's state for the loaded review, if any. */
export default function LoadedReviewStateProvider({ children }: Props) {
  const { loadedReview, reviewAddress } = useLoadedReviewContext();
  if (!loadedReview || !reviewAddress) {
    return children;
  }
  return (
    <ReviewStateProvider
      key={reviewAddressId(reviewAddress)}
      reviewAddress={reviewAddress}
    >
      {children}
    </ReviewStateProvider>
  );
}
