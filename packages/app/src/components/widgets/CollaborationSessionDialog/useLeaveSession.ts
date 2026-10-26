import { useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import deleteSessionBookmark from "../../../business-logic/session-store/deleteSessionBookmark.ts";
import type SessionBookmark from "../../../business-logic/session-store/SessionBookmark.ts";
import endSession from "../../../business-logic/session/endSession.ts";

/**
 * Leaves a session: the owner ends it, the others remove it from this browser.
 * `onLeave` runs before leaving the session's page.
 */
export default function useLeaveSession(
  sessionBookmark: SessionBookmark,
  onLeave: () => void,
): () => Promise<void> {
  const intl = useIntl();
  return async () => {
    const { ownerSecret } = sessionBookmark;
    onLeave();
    // Leave first: on the review's page, its link would join it again.
    navigateTo({ name: RouteName.Start });
    try {
      if (ownerSecret !== null) {
        await endSession(window.location.origin, {
          ...sessionBookmark,
          ownerSecret,
        });
      } else {
        await deleteSessionBookmark(sessionBookmark.sessionId);
      }
    } catch {
      window.alert(
        ownerSecret === null
          ? intl.formatMessage({
              defaultMessage:
                "The session couldn't be removed from this browser. Try again later.",
            })
          : intl.formatMessage({
              defaultMessage: "The session couldn't be ended. Try again later.",
            }),
      );
    }
  };
}
