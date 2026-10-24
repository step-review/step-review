import reviewDatabase from "./reviewDatabase.ts";

/** Removes a review file and its state from the browser. */
export default async function deleteReview(reviewId: string): Promise<void> {
  await reviewDatabase.transaction(
    "rw",
    reviewDatabase.reviews,
    reviewDatabase.reviewFiles,
    reviewDatabase.reviewStates,
    async () => {
      await reviewDatabase.reviews.delete(reviewId);
      await reviewDatabase.reviewFiles.delete(reviewId);
      await reviewDatabase.reviewStates.delete(reviewId);
    },
  );
}
