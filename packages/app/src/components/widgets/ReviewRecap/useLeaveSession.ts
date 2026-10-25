import { useConfirm } from "@primer/react";
import { useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import deleteSessionBookmark from "../../../business-logic/session-store/deleteSessionBookmark.ts";
import type SessionBookmark from "../../../business-logic/session-store/SessionBookmark.ts";
import endSession from "../../../business-logic/session/endSession.ts";

/**
 * Leaves a session, once confirmed: the owner ends it, the others remove it
 * from this browser.
 */
export default function useLeaveSession(
  sessionBookmark: SessionBookmark | null,
): () => Promise<void> {
  const intl = useIntl();
  const confirm = useConfirm();
  return async () => {
    if (!sessionBookmark) {
      return;
    }
    const { ownerSecret } = sessionBookmark;
    const isConfirmed = await confirm(
      ownerSecret === null
        ? {
            title: intl.formatMessage({ defaultMessage: "Leave the review?" }),
            content: intl.formatMessage({
              defaultMessage:
                "The review will be removed from this browser. You can join it again with its link, as a new participant.",
            }),
            confirmButtonContent: intl.formatMessage({
              defaultMessage: "Leave",
            }),
            confirmButtonType: "danger",
          }
        : {
            title: intl.formatMessage({ defaultMessage: "Stop sharing?" }),
            content: intl.formatMessage({
              defaultMessage:
                "The review and every participant's progress will be deleted from the server. Its links will stop working.",
            }),
            confirmButtonContent: intl.formatMessage({
              defaultMessage: "Stop sharing",
            }),
            confirmButtonType: "danger",
          },
    );
    if (!isConfirmed) {
      return;
    }
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
        intl.formatMessage({
          defaultMessage: "The review couldn't be deleted. Try again later.",
        }),
      );
    }
  };
}
