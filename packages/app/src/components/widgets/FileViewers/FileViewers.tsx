import { useIntl } from "react-intl";
import useParticipantLabel from "../../../business-logic/session-participants/useParticipantLabel.ts";
import useSessionParticipants from "../../../business-logic/session-participants/useSessionParticipants.ts";
import InitialsAvatarStack from "../../design-system/InitialsAvatarStack/InitialsAvatarStack.tsx";

interface Props {
  /** The fingerprint of the file's changes. */
  fingerprint: string;
}

/** The other participants of a session who viewed a file. */
export default function FileViewers({ fingerprint }: Props) {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const viewers = (useSessionParticipants() ?? []).filter(
    (sessionParticipant) =>
      !sessionParticipant.isSelf &&
      sessionParticipant.viewedFingerprints.has(fingerprint),
  );
  const people = viewers.map((sessionParticipant) => ({
    key: sessionParticipant.participantId,
    name: sessionParticipant.name,
    label: participantLabel(sessionParticipant),
    colorIndex: sessionParticipant.colorIndex,
  }));
  return (
    <InitialsAvatarStack
      people={people}
      label={intl.formatMessage(
        { defaultMessage: "Viewed by {names}" },
        { names: intl.formatList(people.map((person) => person.label)) },
      )}
    />
  );
}
