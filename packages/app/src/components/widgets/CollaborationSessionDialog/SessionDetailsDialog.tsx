import { Dialog, FormControl, Stack, Text, TextInput } from "@primer/react";
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
  const [name, setName] = useState(sessionConnectionSnapshot.ownState.name);
  const [isConfirmingLeave, setIsConfirmingLeave] = useState(false);
  const leaveSession = useLeaveSession(sessionBookmark, close);
  const link = sessionLink(window.location.origin, sessionBookmark);
  const isOwner = sessionBookmark.ownerSecret !== null;
  const leaveLabel = isOwner
    ? intl.formatMessage({ defaultMessage: "End session" })
    : intl.formatMessage({ defaultMessage: "Leave session" });
  const rename = (newName: string) => {
    setName(newName);
    sessionConnection.rename(newName.trim());
    writeStorage(participantNameStorageKey, newName.trim());
  };
  if (isConfirmingLeave) {
    return (
      // Keyed per step: Primer would keep the footer buttons' previous styles.
      <Dialog
        key="confirmLeave"
        title={
          isOwner
            ? intl.formatMessage({ defaultMessage: "End the session?" })
            : intl.formatMessage({ defaultMessage: "Leave the session?" })
        }
        onClose={close}
        footerButtons={[
          {
            buttonType: "default",
            content: intl.formatMessage({ defaultMessage: "Cancel" }),
            onClick: () => setIsConfirmingLeave(false),
          },
          {
            buttonType: "danger",
            content: leaveLabel,
            onClick: () => void leaveSession(),
          },
        ]}
      >
        <Text as="p" className={styles["paragraph"]}>
          {isOwner ? (
            <FormattedMessage defaultMessage="The review and everyone's progress will be deleted from our servers, and the link will stop working." />
          ) : (
            <FormattedMessage defaultMessage="The review will be removed from this browser. You can join again with the link, as a new participant." />
          )}
        </Text>
      </Dialog>
    );
  }
  return (
    <Dialog
      key="details"
      title={intl.formatMessage({ defaultMessage: "Collaboration session" })}
      onClose={close}
      footerButtons={[
        {
          buttonType: "danger",
          content: leaveLabel,
          onClick: () => setIsConfirmingLeave(true),
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
        <SessionLinkField link={link} isInitiallyCopied={link === copiedLink} />
        <SessionParticipantList onFollow={close} />
      </Stack>
    </Dialog>
  );
}
