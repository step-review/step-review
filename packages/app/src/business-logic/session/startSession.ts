import type LoadedReview from "../review/LoadedReview.ts";
import SessionConnection from "../session-connection/SessionConnection.ts";
import waitForStoredState from "../session-connection/waitForStoredState.ts";
import importSessionKey from "../session-crypto/importSessionKey.ts";
import randomBase64Url from "../session-crypto/randomBase64Url.ts";
import saveSessionBookmark from "../session-store/saveSessionBookmark.ts";
import type SessionBookmark from "../session-store/SessionBookmark.ts";
import uploadReviewFile from "./uploadReviewFile.ts";

/** How long to wait for the owner's state to be stored, in milliseconds. */
const storeStateTimeout = 10_000;

/**
 * Starts a session for a review: uploads it encrypted with a new key, which
 * only the links hold, and joins as its first participant, with the files
 * viewed so far.
 */
export default async function startSession(
  apiOrigin: string,
  loadedReview: LoadedReview,
  participant: { name: string; viewedFingerprints: string[] },
): Promise<SessionBookmark> {
  const sessionBookmark: SessionBookmark = {
    sessionId: randomBase64Url(16),
    sessionKey: randomBase64Url(32),
    title: loadedReview.reviewFile.data.target.title,
    openedAt: Date.now(),
    participantId: randomBase64Url(16),
    participantSecret: randomBase64Url(32),
    ownerSecret: randomBase64Url(32),
  };
  const sessionKey = (await importSessionKey(sessionBookmark.sessionKey))!;
  await uploadReviewFile(
    apiOrigin,
    {
      sessionId: sessionBookmark.sessionId,
      sessionKey,
      ownerSecret: sessionBookmark.ownerSecret!,
    },
    { fileName: loadedReview.fileName, text: loadedReview.text },
  );
  // Saved before storing the state, so that closing the page meanwhile doesn't
  // lose the owner secret, the only way to update or end the session.
  await saveSessionBookmark(sessionBookmark);
  const sessionConnection = new SessionConnection({
    apiOrigin,
    sessionId: sessionBookmark.sessionId,
    sessionKey,
    participantId: sessionBookmark.participantId,
    participantSecret: sessionBookmark.participantSecret,
  });
  sessionConnection.rename(participant.name);
  sessionConnection.dispatch({
    type: "replace",
    reviewState: { viewedFingerprints: participant.viewedFingerprints },
  });
  // Not stored (e.g. sockets are blocked), the owner joins as anyone does.
  await waitForStoredState(sessionConnection, storeStateTimeout);
  sessionConnection.close();
  return sessionBookmark;
}
