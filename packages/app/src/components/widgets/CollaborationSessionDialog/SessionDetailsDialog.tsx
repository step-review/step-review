import {
  Button,
  Dialog,
  FormControl,
  Stack,
  Text,
  TextInput,
} from "@primer/react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import participantNameMaxLength from "../../../business-logic/participant-state/participantNameMaxLength.ts";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import participantNameStorageKey from "../../../business-logic/session-store/participantNameStorageKey.ts";
import sessionLink from "../../../business-logic/session/sessionLink.ts";
import writeStorage from "../../../business-logic/storage/writeStorage.ts";
import SessionLinkField from "../SessionLinkField/SessionLinkField.tsx";
import styles from "./CollaborationSessionDialog.module.css";
import { useCollaborationSessionDialogState } from "./CollaborationSessionDialogProvider.tsx";
import SessionParticipantList from "./SessionParticipantList.tsx";
import useLeaveSession from "./useLeaveSession.ts";

/**
 * The session displayed: the own name, its link and its participants. Ending or
 * leaving it is confirmed in the same dialog, rather than in another one on
 * top.
 */
export default function SessionDetailsDialog() {
  const intl = useIntl();
  const { close, copiedLink } = useCollaborationSessionDialogState();
  const { sessionBookmark, sessionConnection, sessionConnectionSnapshot } =
    useSessionConnectionContext()!;
  const ownName = sessionConnectionSnapshot.ownState.name;
  const [name, setName] = useState(ownName);
  // Follows the own name as it changes: e.g. opened right after starting the
  // session, the dialog shows before the stored state is received.
  const [previousOwnName, setPreviousOwnName] = useState(ownName);
  if (ownName !== previousOwnName) {
    setPreviousOwnName(ownName);
    setName(ownName);
  }
  const [isConfirmingLeave, setIsConfirmingLeave] = useState(false);
  const leaveSession = useLeaveSession(sessionBookmark, close);
  const link = sessionLink(window.location.origin, sessionBookmark);
  const isOwner = sessionBookmark.ownerSecret !== null;
  const leaveLabel = isOwner
    ? intl.formatMessage({ defaultMessage: "End session" })
    : intl.formatMessage({ defaultMessage: "Leave session" });
  // Saved once typed, rather than on every keystroke: each rename writes the
  // whole state, for every participant to receive.
  const saveName = () => {
    const trimmedName = name.trim();
    if (trimmedName !== ownName) {
      sessionConnection.rename(trimmedName);
      writeStorage(participantNameStorageKey, trimmedName);
    }
  };
  const closeDialog = () => {
    saveName();
    close();
  };
  return (
    <Dialog
      title={
        !isConfirmingLeave
          ? intl.formatMessage({ defaultMessage: "Collaboration session" })
          : isOwner
            ? intl.formatMessage({ defaultMessage: "End the session?" })
            : intl.formatMessage({ defaultMessage: "Leave the session?" })
      }
      onClose={closeDialog}
      // Buttons keyed by what they do: rendered by Primer, those in the same
      // place would keep the previous step's styles.
      renderFooter={() => (
        <Dialog.Footer>
          {isConfirmingLeave ? (
            <>
              <Button key="cancel" onClick={() => setIsConfirmingLeave(false)}>
                <FormattedMessage defaultMessage="Cancel" />
              </Button>
              <Button
                key="leave"
                variant="danger"
                onClick={() => void leaveSession()}
              >
                {leaveLabel}
              </Button>
            </>
          ) : (
            <>
              <Button
                key="confirmLeave"
                variant="danger"
                onClick={() => setIsConfirmingLeave(true)}
              >
                {leaveLabel}
              </Button>
              <Button key="done" variant="primary" onClick={closeDialog}>
                <FormattedMessage defaultMessage="Done" />
              </Button>
            </>
          )}
        </Dialog.Footer>
      )}
    >
      {isConfirmingLeave ? (
        <Text as="p" className={styles["paragraph"]}>
          {isOwner ? (
            <FormattedMessage defaultMessage="The review and everyone's progress will be deleted from our servers, and the link will stop working." />
          ) : (
            <FormattedMessage defaultMessage="The review will be removed from this browser. You can join again with the link, as a new participant." />
          )}
        </Text>
      ) : (
        <Stack gap="normal">
          <FormControl>
            <FormControl.Label>
              <FormattedMessage defaultMessage="Your name" />
            </FormControl.Label>
            <TextInput
              block
              value={name}
              maxLength={participantNameMaxLength}
              onChange={(event) => setName(event.currentTarget.value)}
              onBlur={saveName}
            />
          </FormControl>
          <SessionLinkField
            link={link}
            isInitiallyCopied={link === copiedLink}
          />
          <SessionParticipantList onFollow={closeDialog} />
        </Stack>
      )}
    </Dialog>
  );
}
