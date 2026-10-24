import randomBase64Url from "../share-crypto/randomBase64Url.ts";
import saveShareBookmark from "../share-store/saveShareBookmark.ts";
import type ShareBookmark from "../share-store/ShareBookmark.ts";
import updateShareBookmark from "../share-store/updateShareBookmark.ts";

/**
 * Bookmarks a share opened from a link, as a new participant. A share already
 * bookmarked takes the link's key, keeping its participant.
 */
export default async function joinShare(
  shareId: string,
  shareKey: string,
  shareBookmark: ShareBookmark | null,
): Promise<void> {
  if (shareBookmark) {
    await updateShareBookmark(shareId, { shareKey });
    return;
  }
  await saveShareBookmark({
    shareId,
    shareKey,
    title: "",
    openedAt: Date.now(),
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
    ownerSecret: null,
  });
}
