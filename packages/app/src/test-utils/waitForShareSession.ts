import type ShareSession from "../business-logic/share-session/ShareSession.ts";
import type ShareSessionSnapshot from "../business-logic/share-session/ShareSessionSnapshot.ts";

/** Resolves with the session's snapshot once it matches the condition. */
export default function waitForShareSession(
  shareSession: ShareSession,
  condition: (shareSessionSnapshot: ShareSessionSnapshot) => boolean,
): Promise<ShareSessionSnapshot> {
  return new Promise((resolve) => {
    const check = () => {
      const shareSessionSnapshot = shareSession.getSnapshot();
      if (condition(shareSessionSnapshot)) {
        unsubscribe();
        resolve(shareSessionSnapshot);
      }
    };
    const unsubscribe = shareSession.subscribe(check);
    check();
  });
}
