import type LoadedReview from "../review/LoadedReview.ts";
import importShareKey from "../share-crypto/importShareKey.ts";
import randomBase64Url from "../share-crypto/randomBase64Url.ts";
import ShareSession from "../share-session/ShareSession.ts";
import waitForStoredState from "../share-session/waitForStoredState.ts";
import saveShareBookmark from "../share-store/saveShareBookmark.ts";
import type ShareBookmark from "../share-store/ShareBookmark.ts";
import uploadReviewFile from "./uploadReviewFile.ts";

/** How long to wait for the sharer's state to be stored, in milliseconds. */
const storeStateTimeout = 10_000;

/**
 * Shares a review: uploads it encrypted with a new key, which only the links
 * hold, and joins as its first participant, with the files viewed so far.
 */
export default async function createShare(
  apiOrigin: string,
  loadedReview: LoadedReview,
  participant: { name: string; viewedFingerprints: string[] },
): Promise<ShareBookmark> {
  const shareBookmark: ShareBookmark = {
    shareId: randomBase64Url(16),
    shareKey: randomBase64Url(32),
    title: loadedReview.reviewFile.data.target.title,
    openedAt: Date.now(),
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
    ownerSecret: randomBase64Url(32),
  };
  const shareKey = (await importShareKey(shareBookmark.shareKey))!;
  await uploadReviewFile(
    apiOrigin,
    {
      shareId: shareBookmark.shareId,
      shareKey,
      ownerSecret: shareBookmark.ownerSecret!,
    },
    { fileName: loadedReview.fileName, text: loadedReview.text },
  );
  const shareSession = new ShareSession({
    apiOrigin,
    shareId: shareBookmark.shareId,
    shareKey,
    participantId: shareBookmark.participantId,
    participantSecret: shareBookmark.participantSecret,
  });
  shareSession.dispatch({ type: "rename", name: participant.name });
  shareSession.dispatch({
    type: "replace",
    reviewState: { viewedFingerprints: participant.viewedFingerprints },
  });
  // Not stored (e.g. sockets are blocked), the sharer joins as anyone does.
  await waitForStoredState(shareSession, storeStateTimeout);
  shareSession.close();
  await saveShareBookmark(shareBookmark);
  return shareBookmark;
}
