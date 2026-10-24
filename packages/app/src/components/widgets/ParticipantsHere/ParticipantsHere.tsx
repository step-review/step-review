import { useIntl } from "react-intl";
import useParticipantLabel from "../../../business-logic/share-participants/useParticipantLabel.ts";
import useShareParticipants from "../../../business-logic/share-participants/useShareParticipants.ts";
import InitialsAvatarStack from "../../design-system/InitialsAvatarStack/InitialsAvatarStack.tsx";

interface Props {
  /** `null` for the overview. */
  stepId: string | null;
}

/** The other participants of a shared review who are on a step. */
export default function ParticipantsHere({ stepId }: Props) {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const participantsHere = (useShareParticipants() ?? []).filter(
    (shareParticipant) =>
      !shareParticipant.isSelf && shareParticipant.stepIds.includes(stepId),
  );
  const people = participantsHere.map((shareParticipant) => ({
    key: shareParticipant.participantId,
    name: shareParticipant.name,
    label: participantLabel(shareParticipant),
    colorIndex: shareParticipant.colorIndex,
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
