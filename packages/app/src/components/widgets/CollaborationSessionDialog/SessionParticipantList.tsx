import { Tooltip, VisuallyHidden } from "@primer/react";
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
            <ParticipantChip
              sessionParticipant={sessionParticipant}
              onFollow={onFollow}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface ParticipantChipProps {
  sessionParticipant: SessionParticipantView;
  onFollow: () => void;
}

/**
 * A participant, as a chip with their avatar and name; another one who is on a
 * step can be followed there.
 */
function ParticipantChip({
  sessionParticipant,
  onFollow,
}: ParticipantChipProps) {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const { reviewAddress } = useCurrentReviewView();
  const label = participantLabel(sessionParticipant);
  const content = (
    <>
      {/* Named by the chip's text. */}
      <span className={styles["avatar"]} aria-hidden>
        <InitialsAvatar
          name={sessionParticipant.name}
          label={label}
          colorIndex={sessionParticipant.colorIndex}
          size="small"
          isDimmed={!sessionParticipant.isOnline}
        />
      </span>
      <span className={styles["name"]}>{label}</span>
      {!sessionParticipant.isOnline && (
        <VisuallyHidden>
          <FormattedMessage defaultMessage="(offline)" />
        </VisuallyHidden>
      )}
    </>
  );
  const isOffline = !sessionParticipant.isOnline || undefined;
  // Follows the first tab, to its step and file.
  const [firstLocation] = sessionParticipant.locations;
  if (!firstLocation) {
    return (
      <span className={styles["chip"]} data-offline={isOffline}>
        {content}
      </span>
    );
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
    <Tooltip
      text={intl.formatMessage(
        { defaultMessage: "Go to where {name} is" },
        { name: label },
      )}
      direction="n"
    >
      <button
        type="button"
        className={styles["chip"]}
        data-offline={isOffline}
        onClick={follow}
      >
        {content}
      </button>
    </Tooltip>
  );
}
