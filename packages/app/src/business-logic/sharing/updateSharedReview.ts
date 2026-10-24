import type LoadedReview from "../review/LoadedReview.ts";
import type ShareBookmark from "../share-store/ShareBookmark.ts";
import uploadReviewFile from "./uploadReviewFile.ts";

/**
 * Replaces a shared review with a new version of it, e.g. after the agent
 * reviewed the PR again. Only the browser that shared it can.
 */
export default async function updateSharedReview(
  apiOrigin: string,
  shareBookmark: ShareBookmark & { ownerSecret: string },
  shareKey: CryptoKey,
  loadedReview: LoadedReview,
): Promise<void> {
  await uploadReviewFile(
    apiOrigin,
    {
      shareId: shareBookmark.shareId,
      shareKey,
      ownerSecret: shareBookmark.ownerSecret,
    },
    { fileName: loadedReview.fileName, text: loadedReview.text },
  );
}
