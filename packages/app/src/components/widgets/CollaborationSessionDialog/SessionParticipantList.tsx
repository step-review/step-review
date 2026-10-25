import { ArrowRightIcon } from "@primer/octicons-react";
import { useId } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import type SessionParticipantView from "../../../business-logic/session-participants/SessionParticipantView.ts";
import useParticipantLabel from "../../../business-logic/session-participants/useParticipantLabel.ts";
import useSessionParticipants from "../../../business-logic/session-participants/useSessionParticipants.ts";
import InitialsAvatar from "../../design-system/InitialsAvatar/InitialsAvatar.tsx";
import styles from "./SessionParticipantList.module.css";

interface Props {
  /** Called when going to where another participant is. */
  onFollow: () => void;
}

/** The participants of the session displayed, the own one first. */
export default function SessionParticipantList({ onFollow }: Props) {
  const headingId = useId();
  const sessionParticipants = useSessionParticipants() ?? [];
  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className={styles["heading"]}>
        <FormattedMessage defaultMessage="Participants" />
      </h3>
      <ul className={styles["list"]}>
        {sessionParticipants.map((sessionParticipant) => (
          <li key={sessionParticipant.participantId}>
            <ParticipantRow
              sessionParticipant={sessionParticipant}
              onFollow={onFollow}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface ParticipantRowProps {
  sessionParticipant: SessionParticipantView;
  onFollow: () => void;
}

/** A participant; another one who is on a step can be followed there. */
function ParticipantRow({ sessionParticipant, onFollow }: ParticipantRowProps) {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const { reviewAddress } = useCurrentReviewView();
  const label = participantLabel(sessionParticipant);
  const content = (
    <>
      <InitialsAvatar
        name={sessionParticipant.name}
        label={label}
        colorIndex={sessionParticipant.colorIndex}
        isDimmed={!sessionParticipant.isOnline}
      />
      <span className={styles["name"]}>{label}</span>
      {!sessionParticipant.isOnline && (
        <span className={styles["status"]}>
          <FormattedMessage defaultMessage="Offline" />
        </span>
      )}
    </>
  );
  // Follows the first tab, to its step and file.
  const [firstLocation] = sessionParticipant.locations;
  if (!firstLocation) {
    return <div className={styles["row"]}>{content}</div>;
  }
  const follow = () => {
    onFollow();
    navigateTo(
      firstLocation.stepId === null
        ? { name: RouteName.Overview, reviewAddress }
        : { name: RouteName.Step, reviewAddress, stepId: firstLocation.stepId },
      firstLocation.fileId ? `file-${firstLocation.fileId}` : undefined,
    );
  };
  return (
    <button
      type="button"
      className={styles["row"]}
      aria-label={intl.formatMessage(
        { defaultMessage: "Go to where {name} is" },
        { name: label },
      )}
      onClick={follow}
    >
      {content}
      <span className={styles["followIcon"]}>
        <ArrowRightIcon />
      </span>
    </button>
  );
}
