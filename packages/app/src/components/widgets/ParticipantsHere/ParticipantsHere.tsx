import { useIntl } from "react-intl";
import useParticipantLabel from "../../../business-logic/session-participants/useParticipantLabel.ts";
import useSessionParticipants from "../../../business-logic/session-participants/useSessionParticipants.ts";
import InitialsAvatarStack from "../../design-system/InitialsAvatarStack/InitialsAvatarStack.tsx";

type Props =
  | {
      /** `null` for the overview. */
      stepId: string | null;
    }
  | { fileId: string };

/** The other participants of a session who are on a step, or a file. */
export default function ParticipantsHere(props: Props) {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const participantsHere = (useSessionParticipants() ?? []).filter(
    (sessionParticipant) =>
      !sessionParticipant.isSelf &&
      sessionParticipant.locations.some((location) =>
        "fileId" in props
          ? location.fileId === props.fileId
          : location.stepId === props.stepId,
      ),
  );
  const people = participantsHere.map((sessionParticipant) => ({
    key: sessionParticipant.participantId,
    name: sessionParticipant.name,
    label: participantLabel(sessionParticipant),
    colorIndex: sessionParticipant.colorIndex,
  }));
  return (
    <InitialsAvatarStack
      people={people}
      label={intl.formatMessage(
        {
          defaultMessage:
            "{count, plural, one {{names} is here} other {{names} are here}}",
        },
        {
          count: people.length,
          names: intl.formatList(people.map((person) => person.label)),
        },
      )}
    />
  );
}
