import { useIntl } from "react-intl";
import useParticipantLabel from "../../../business-logic/session-participants/useParticipantLabel.ts";
import useSessionParticipants from "../../../business-logic/session-participants/useSessionParticipants.ts";

type Location =
  | {
      /** `null` for the overview. */
      stepId: string | null;
    }
  | { fileId: string };

interface ParticipantsHere {
  people: { key: string; name: string; label: string; colorIndex: number }[];
  /** Who they are, e.g. "Ann and Bo are here". */
  label: string;
}

/** The other participants of a session who are on a step, or a file. */
export default function useParticipantsHere(
  location: Location,
): ParticipantsHere {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const people = (useSessionParticipants() ?? [])
    .filter(
      (sessionParticipant) =>
        !sessionParticipant.isSelf &&
        sessionParticipant.locations.some((participantLocation) =>
          "fileId" in location
            ? participantLocation.fileId === location.fileId
            : participantLocation.stepId === location.stepId,
        ),
    )
    .map((sessionParticipant) => ({
      key: sessionParticipant.participantId,
      name: sessionParticipant.name,
      label: participantLabel(sessionParticipant),
      colorIndex: sessionParticipant.colorIndex,
    }));
  const label = intl.formatMessage(
    {
      defaultMessage:
        "{count, plural, one {{names} is here} other {{names} are here}}",
    },
    {
      count: people.length,
      names: intl.formatList(people.map((person) => person.label)),
    },
  );
  return { people, label };
}
