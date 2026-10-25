import type SessionConnection from "./SessionConnection.ts";

/**
 * Resolves once the connection stored the own state's changes, or can't, or
 * after the timeout: whether they were stored.
 */
export default function waitForStoredState(
  sessionConnection: SessionConnection,
  timeout: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    const check = () => {
      const { connectionStatus, hasPendingChanges } =
        sessionConnection.getSnapshot();
      if (connectionStatus === "connected" && !hasPendingChanges) {
        finish(true);
      } else if (connectionStatus === "ended") {
        finish(false);
      }
    };
    const unsubscribe = sessionConnection.subscribe(check);
    const timeoutId = setTimeout(() => finish(false), timeout);
    function finish(isStored: boolean) {
      unsubscribe();
      clearTimeout(timeoutId);
      resolve(isStored);
    }
    check();
  });
}
