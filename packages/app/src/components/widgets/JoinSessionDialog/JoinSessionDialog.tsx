import { useIntl } from "react-intl";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import participantNameStorageKey from "../../../business-logic/session-store/participantNameStorageKey.ts";
import readParticipantName from "../../../business-logic/session-store/readParticipantName.ts";
import writeStorage from "../../../business-logic/storage/writeStorage.ts";
import ParticipantNameDialog from "../ParticipantNameDialog/ParticipantNameDialog.tsx";

/** Asks a new participant of the session displayed for their name. */
export default function JoinSessionDialog() {
  const intl = useIntl();
  const sessionConnectionContext = useSessionConnectionContext();
  if (!sessionConnectionContext?.sessionConnectionSnapshot.isNewParticipant) {
    return null;
  }
  const { sessionConnection } = sessionConnectionContext;
  const rename = (name: string) => {
    sessionConnection.rename(name);
    writeStorage(participantNameStorageKey, name);
  };
  return (
    <ParticipantNameDialog
      title={intl.formatMessage({ defaultMessage: "Join the session" })}
      description={intl.formatMessage({
        defaultMessage:
          "The other participants will see your name, the files you viewed, and where you are.",
      })}
      submitLabel={intl.formatMessage({ defaultMessage: "Join" })}
      initialName={readParticipantName()}
      onSubmit={rename}
      // Joins without a name, so that it isn't asked again, and keeps the
      // name suggested for the next session.
      onClose={() => sessionConnection.rename("")}
    />
  );
}
