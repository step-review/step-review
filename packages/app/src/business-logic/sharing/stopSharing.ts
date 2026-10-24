import deleteShareBookmark from "../share-store/deleteShareBookmark.ts";
import type ShareBookmark from "../share-store/ShareBookmark.ts";
import deleteShare from "./deleteShare.ts";

/**
 * Deletes a share from the server, for every participant, and forgets it in
 * this browser.
 */
export default async function stopSharing(
  apiOrigin: string,
  shareBookmark: ShareBookmark & { ownerSecret: string },
): Promise<void> {
  await deleteShare(
    apiOrigin,
    shareBookmark.shareId,
    shareBookmark.ownerSecret,
  );
  await deleteShareBookmark(shareBookmark.shareId);
}
