import { Banner, Dialog, FormControl, Stack, TextInput } from "@primer/react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import useNavigationState from "../../../business-logic/navigation/useNavigationState.ts";
import participantNameMaxLength from "../../../business-logic/participant-state/participantNameMaxLength.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import participantNameStorageKey from "../../../business-logic/session-store/participantNameStorageKey.ts";
import readParticipantName from "../../../business-logic/session-store/readParticipantName.ts";
import sessionLink from "../../../business-logic/session/sessionLink.ts";
import startSession from "../../../business-logic/session/startSession.ts";
import writeStorage from "../../../business-logic/storage/writeStorage.ts";
import SessionLinkField from "../SessionLinkField/SessionLinkField.tsx";
import styles from "./CollaborationSessionDialog.module.css";
import { useCollaborationSessionDialogState } from "./CollaborationSessionDialogProvider.tsx";
import useLeaveSession from "./useLeaveSession.ts";

interface Props {
  loadedReview: LoadedReview;
  /** The files viewed so far, which the owner keeps in the session. */
  viewedFingerprints: string[];
}

/**
 * Starts a collaboration session for a review kept in the browser, or, in a
 * session, gives its link and the own name.
 */
export default function CollaborationSessionDialog({
  loadedReview,
  viewedFingerprints,
}: Props) {
  return useSessionConnectionContext() ? (
    <SessionDetails />
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
  const [, setIsOpen] = useCollaborationSessionDialogState();
  const [status, setStatus] = useState<"idle" | "starting" | "failed">("idle");
  const start = async () => {
    setStatus("starting");
    try {
      const { sessionId, sessionKey } = await startSession(
        window.location.origin,
        loadedReview,
        { name: readParticipantName(), viewedFingerprints },
      );
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
      onClose={() => setIsOpen(false)}
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
        <ul className={styles["points"]}>
          <li>
            <FormattedMessage defaultMessage="The review is uploaded to our servers encrypted." />
          </li>
          <li>
            <FormattedMessage defaultMessage="The key to decrypt it is in the link, so anyone with the link can read it (but we can't)." />
          </li>
          <li>
            <FormattedMessage defaultMessage="The session is deleted after 30 days without activity." />
          </li>
        </ul>
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

function SessionDetails() {
  const intl = useIntl();
  const [, setIsOpen] = useCollaborationSessionDialogState();
  const close = () => setIsOpen(false);
  const { sessionBookmark, sessionConnection, sessionConnectionSnapshot } =
    useSessionConnectionContext()!;
  const [name, setName] = useState(sessionConnectionSnapshot.ownState.name);
  const leaveSession = useLeaveSession(sessionBookmark, close);
  const rename = (newName: string) => {
    setName(newName);
    sessionConnection.rename(newName.trim());
    writeStorage(participantNameStorageKey, newName.trim());
  };
  return (
    <Dialog
      title={intl.formatMessage({ defaultMessage: "Collaboration session" })}
      onClose={close}
      footerButtons={[
        {
          buttonType: "danger",
          content:
            sessionBookmark.ownerSecret === null
              ? intl.formatMessage({ defaultMessage: "Leave session" })
              : intl.formatMessage({ defaultMessage: "End session" }),
          onClick: () => void leaveSession(),
        },
        {
          buttonType: "primary",
          content: intl.formatMessage({ defaultMessage: "Done" }),
          onClick: close,
        },
      ]}
    >
      <Stack gap="normal">
        <FormControl>
          <FormControl.Label>
            <FormattedMessage defaultMessage="Your name" />
          </FormControl.Label>
          <TextInput
            block
            value={name}
            maxLength={participantNameMaxLength}
            onChange={(event) => rename(event.currentTarget.value)}
          />
        </FormControl>
        <SessionLinkField
          link={sessionLink(window.location.origin, sessionBookmark)}
        />
      </Stack>
    </Dialog>
  );
}
