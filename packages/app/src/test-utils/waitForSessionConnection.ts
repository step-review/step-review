import type SessionConnection from "../business-logic/session-connection/SessionConnection.ts";
import type SessionConnectionSnapshot from "../business-logic/session-connection/SessionConnectionSnapshot.ts";

/** Resolves with the connection's snapshot once it matches the condition. */
export default function waitForSessionConnection(
  sessionConnection: SessionConnection,
  condition: (sessionConnectionSnapshot: SessionConnectionSnapshot) => boolean,
): Promise<SessionConnectionSnapshot> {
  return new Promise((resolve) => {
    const check = () => {
      const sessionConnectionSnapshot = sessionConnection.getSnapshot();
      if (condition(sessionConnectionSnapshot)) {
        unsubscribe();
        resolve(sessionConnectionSnapshot);
      }
    };
    const unsubscribe = sessionConnection.subscribe(check);
    check();
  });
}
