import InitialsAvatarStack from "../../design-system/InitialsAvatarStack/InitialsAvatarStack.tsx";
import useParticipantsHere from "./useParticipantsHere.ts";

type Props =
  | {
      /** `null` for the overview. */
      stepId: string | null;
    }
  | { fileId: string };

/** The other participants of a session who are on a step, or a file. */
export default function ParticipantsHere(props: Props) {
  const { people, label } = useParticipantsHere(props);
  return <InitialsAvatarStack people={people} label={label} />;
}
