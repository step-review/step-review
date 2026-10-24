import type LoadedReview from "../review/LoadedReview.ts";
import reviewDatabase from "./reviewDatabase.ts";

/**
 * Keeps a review file in the browser, replacing the one with the same ID. The
 * review state is kept, so files whose changes are the same stay viewed.
 */
export default async function saveReview(
  loadedReview: LoadedReview,
  text: string,
): Promise<void> {
  await reviewDatabase.transaction(
    "rw",
    reviewDatabase.reviews,
    reviewDatabase.reviewFiles,
    async () => {
      await reviewDatabase.reviews.put({
        reviewId: loadedReview.reviewId,
        title: loadedReview.reviewFile.data.target.title,
        fileName: loadedReview.fileName,
        openedAt: Date.now(),
      });
      await reviewDatabase.reviewFiles.put(text, loadedReview.reviewId);
    },
  );
}
