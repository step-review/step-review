import { useIntl } from "react-intl";
import useParticipantLabel from "../../../business-logic/share-participants/useParticipantLabel.ts";
import useShareParticipants from "../../../business-logic/share-participants/useShareParticipants.ts";
import InitialsAvatarStack from "../../design-system/InitialsAvatarStack/InitialsAvatarStack.tsx";

interface Props {
  /** The fingerprint of the file's changes. */
  fingerprint: string;
}

/** The other participants of a shared review who viewed a file. */
export default function FileViewers({ fingerprint }: Props) {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const viewers = (useShareParticipants() ?? []).filter(
    (shareParticipant) =>
      !shareParticipant.isSelf &&
      shareParticipant.viewedFingerprints.has(fingerprint),
  );
  const people = viewers.map((shareParticipant) => ({
    key: shareParticipant.participantId,
    name: shareParticipant.name,
    label: participantLabel(shareParticipant),
    colorIndex: shareParticipant.colorIndex,
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
