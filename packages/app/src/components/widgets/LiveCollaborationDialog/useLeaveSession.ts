import { useConfirm } from "@primer/react";
import { useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import deleteSessionBookmark from "../../../business-logic/session-store/deleteSessionBookmark.ts";
import type SessionBookmark from "../../../business-logic/session-store/SessionBookmark.ts";
import endSession from "../../../business-logic/session/endSession.ts";

/**
 * Leaves a session, once confirmed: the owner ends it, the others remove it
 * from this browser. `onConfirm` runs before leaving the session's page.
 */
export default function useLeaveSession(
  sessionBookmark: SessionBookmark,
  onConfirm: () => void,
): () => Promise<void> {
  const intl = useIntl();
  const confirm = useConfirm();
  return async () => {
    const { ownerSecret } = sessionBookmark;
    const isConfirmed = await confirm(
      ownerSecret === null
        ? {
            title: intl.formatMessage({ defaultMessage: "Leave the session?" }),
            content: intl.formatMessage({
              defaultMessage:
                "The review will be removed from this browser. You can join again with the link, as a new participant.",
            }),
            confirmButtonContent: intl.formatMessage({
              defaultMessage: "Leave session",
            }),
            confirmButtonType: "danger",
          }
        : {
            title: intl.formatMessage({ defaultMessage: "End the session?" }),
            content: intl.formatMessage({
              defaultMessage:
                "The review and everyone's progress will be deleted from our servers, and the link will stop working.",
            }),
            confirmButtonContent: intl.formatMessage({
              defaultMessage: "End session",
            }),
            confirmButtonType: "danger",
          },
    );
    if (!isConfirmed) {
      return;
    }
    onConfirm();
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
