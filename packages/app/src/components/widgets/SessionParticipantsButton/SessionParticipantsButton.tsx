import { Tooltip } from "@primer/react";
import { useIntl } from "react-intl";
import useParticipantLabel from "../../../business-logic/session-participants/useParticipantLabel.ts";
import useSessionParticipants from "../../../business-logic/session-participants/useSessionParticipants.ts";
import InitialsAvatar from "../../design-system/InitialsAvatar/InitialsAvatar.tsx";
import styles from "./SessionParticipantsButton.module.css";

interface Props {
  onClick: () => void;
}

const maxVisibleAvatarCount = 3;

/**
 * The participants of the session displayed, as a few overlapping avatars and
 * how many others there are, to open the session's dialog.
 */
export default function SessionParticipantsButton({ onClick }: Props) {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const sessionParticipants = useSessionParticipants() ?? [];
  const visibleParticipants = sessionParticipants.slice(
    0,
    maxVisibleAvatarCount,
  );
  const hiddenCount = sessionParticipants.length - visibleParticipants.length;
  const label = intl.formatMessage(
    {
      defaultMessage:
        "Collaboration session: {count, plural, one {# participant} other {# participants}}",
    },
    { count: sessionParticipants.length },
  );
  return (
    <Tooltip text={label} type="label" direction="n">
      <button type="button" className={styles["button"]} onClick={onClick}>
        {/* Reversed, so that each avatar overlaps the next one. */}
        <span className={styles["avatars"]} aria-hidden>
          {visibleParticipants.toReversed().map((sessionParticipant) => (
            <span
              key={sessionParticipant.participantId}
              className={styles["avatar"]}
            >
              <InitialsAvatar
                name={sessionParticipant.name}
                label={participantLabel(sessionParticipant)}
                colorIndex={sessionParticipant.colorIndex}
                isDimmed={!sessionParticipant.isOnline}
              />
            </span>
          ))}
        </span>
        {hiddenCount > 0 && (
          <span className={styles["hiddenCount"]} aria-hidden>
            +{hiddenCount}
          </span>
        )}
      </button>
    </Tooltip>
  );
}
