import type LoadedReview from "../review/LoadedReview.ts";
import type SessionBookmark from "../session-store/SessionBookmark.ts";
import uploadReviewFile from "./uploadReviewFile.ts";

/**
 * Replaces a session's review with a new version of it, e.g. after the agent
 * reviewed the PR again. Only the browser that started the session can.
 */
export default async function updateSessionReview(
  apiOrigin: string,
  sessionBookmark: SessionBookmark & { ownerSecret: string },
  sessionKey: CryptoKey,
  loadedReview: LoadedReview,
): Promise<void> {
  await uploadReviewFile(
    apiOrigin,
    {
      sessionId: sessionBookmark.sessionId,
      sessionKey,
      ownerSecret: sessionBookmark.ownerSecret,
    },
    { fileName: loadedReview.fileName, text: loadedReview.text },
  );
}
