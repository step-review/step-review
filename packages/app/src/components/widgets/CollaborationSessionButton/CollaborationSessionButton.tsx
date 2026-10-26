import { PeopleIcon } from "@primer/octicons-react";
import { IconButton } from "@primer/react";
import { useIntl } from "react-intl";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import { useCollaborationSessionDialogState } from "../CollaborationSessionDialog/CollaborationSessionDialogProvider.tsx";
import SessionParticipantsButton from "../SessionParticipantsButton/SessionParticipantsButton.tsx";
import styles from "./CollaborationSessionButton.module.css";

interface Props {
  /** Vertical in the sidebar's rail, with its tooltip on the right. */
  orientation: "horizontal" | "vertical";
}

/**
 * Opens the collaboration session's dialog: the session's participants, or a
 * highlighted button to start one.
 */
export default function CollaborationSessionButton({ orientation }: Props) {
  const intl = useIntl();
  const isInSession = useSessionConnectionContext() !== null;
  const collaborationSessionDialogState = useCollaborationSessionDialogState();
  return isInSession ? (
    <SessionParticipantsButton
      orientation={orientation}
      onClick={collaborationSessionDialogState.open}
    />
  ) : (
    <IconButton
      className={styles["startButton"]}
      tooltipDirection={orientation === "vertical" ? "e" : "n"}
      variant="invisible"
      size="small"
      icon={PeopleIcon}
      aria-label={intl.formatMessage({
        defaultMessage: "Start collaboration session",
      })}
      onClick={collaborationSessionDialogState.open}
    />
  );
}
