import { Banner, Dialog, Stack, Text } from "@primer/react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useNavigationState from "../../../business-logic/navigation/useNavigationState.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import readParticipantName from "../../../business-logic/session-store/readParticipantName.ts";
import sessionLink from "../../../business-logic/session/sessionLink.ts";
import startSession from "../../../business-logic/session/startSession.ts";
import styles from "./CollaborationSessionDialog.module.css";
import { useCollaborationSessionDialogState } from "./CollaborationSessionDialogProvider.tsx";
import SessionDetailsDialog from "./SessionDetailsDialog.tsx";

interface Props {
  loadedReview: LoadedReview;
  /** The files viewed so far, which the owner keeps in the session. */
  viewedFingerprints: string[];
}

/**
 * Starts a collaboration session for a review kept in the browser, or, in a
 * session, shows it.
 */
export default function CollaborationSessionDialog({
  loadedReview,
  viewedFingerprints,
}: Props) {
  return useSessionConnectionContext() ? (
    <SessionDetailsDialog />
  ) : (
    <SessionStart
      loadedReview={loadedReview}
      viewedFingerprints={viewedFingerprints}
    />
  );
}

type SessionStartProps = Props;

function SessionStart({ loadedReview, viewedFingerprints }: SessionStartProps) {
  const intl = useIntl();
  const route = useNavigationState();
  const { close, setCopiedLink } = useCollaborationSessionDialogState();
  const [status, setStatus] = useState<"idle" | "starting" | "failed">("idle");
  // Called right away, while handling the click: browsers only let pages write
  // to the clipboard then. The link follows once the session starts.
  const copyLink = async (linkPromise: Promise<string>) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": linkPromise.then(
            (link) => new Blob([link], { type: "text/plain" }),
          ),
        }),
      ]);
      setCopiedLink(await linkPromise);
    } catch {
      // Not copied (e.g. the session didn't start, or the browser refused):
      // the dialog still gives the link to copy.
    }
  };
  const start = async () => {
    setStatus("starting");
    const sessionBookmarkPromise = startSession(
      window.location.origin,
      loadedReview,
      { name: readParticipantName(), viewedFingerprints },
    );
    const linkPromise = sessionBookmarkPromise.then((sessionBookmark) =>
      sessionLink(window.location.origin, sessionBookmark),
    );
    void copyLink(linkPromise);
    try {
      const { sessionId, sessionKey } = await sessionBookmarkPromise;
      // The same page, of the session: the dialog stays open, with its link.
      const reviewAddress = { kind: "session", sessionId, sessionKey } as const;
      navigateTo(
        route.name === RouteName.Step
          ? { ...route, reviewAddress }
          : { name: RouteName.Overview, reviewAddress },
      );
    } catch {
      setStatus("failed");
    }
  };
  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Start collaboration session",
      })}
      onClose={close}
      footerButtons={[
        {
          buttonType: "primary",
          content: intl.formatMessage({ defaultMessage: "Start session" }),
          loading: status === "starting",
          onClick: () => void start(),
        },
      ]}
    >
      <Stack gap="normal">
        <div>
          <Text as="p" className={styles["intro"]}>
            <FormattedMessage defaultMessage="What to know:" />
          </Text>
          <ul className={styles["points"]}>
            <li>
              <FormattedMessage defaultMessage="The review is uploaded to our servers encrypted." />
            </li>
            <li>
              <FormattedMessage defaultMessage="The key to decrypt it is in the link, and is never sent to our servers." />
            </li>
            <li>
              <FormattedMessage defaultMessage="Anyone with the link can read the review." />
            </li>
            <li>
              <FormattedMessage defaultMessage="The session is deleted after 30 days without activity." />
            </li>
          </ul>
        </div>
        {status === "failed" && (
          <Banner
            variant="critical"
            title={intl.formatMessage({
              defaultMessage: "Couldn't start the session",
            })}
            hideTitle
            description={
              <FormattedMessage defaultMessage="The review couldn't be uploaded. Try again later." />
            }
          />
        )}
      </Stack>
    </Dialog>
  );
}
