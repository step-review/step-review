import type LoadedReview from "../review/LoadedReview.ts";
import rememberAddedReview from "./rememberAddedReview.ts";
import reviewDatabase from "./reviewDatabase.ts";

/**
 * Keeps a review file in the browser. Opening the same file again keeps its
 * review state.
 */
export default async function saveReview(
  loadedReview: LoadedReview,
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
      await reviewDatabase.reviewFiles.put(
        loadedReview.text,
        loadedReview.reviewId,
      );
    },
  );
  rememberAddedReview();
}
