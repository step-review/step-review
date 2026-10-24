import type ShareSession from "./ShareSession.ts";

/**
 * Resolves once the session stored the own state's changes, or can't, or after
 * the timeout: whether they were stored.
 */
export default function waitForStoredState(
  shareSession: ShareSession,
  timeout: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    const check = () => {
      const { connectionStatus, hasPendingChanges } =
        shareSession.getSnapshot();
      if (connectionStatus === "connected" && !hasPendingChanges) {
        finish(true);
      } else if (connectionStatus === "ended") {
        finish(false);
      }
    };
    const unsubscribe = shareSession.subscribe(check);
    const timeoutId = setTimeout(() => finish(false), timeout);
    function finish(isStored: boolean) {
      unsubscribe();
      clearTimeout(timeoutId);
      resolve(isStored);
    }
    check();
  });
}
