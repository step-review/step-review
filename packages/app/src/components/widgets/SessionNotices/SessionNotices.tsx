import { Banner } from "@primer/react";
import { useIntl } from "react-intl";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import type SessionEndReason from "../../../business-logic/session-connection/SessionEndReason.ts";
import participantNameStorageKey from "../../../business-logic/session-store/participantNameStorageKey.ts";
import readParticipantName from "../../../business-logic/session-store/readParticipantName.ts";
import writeStorage from "../../../business-logic/storage/writeStorage.ts";
import ParticipantNameDialog from "../ParticipantNameDialog/ParticipantNameDialog.tsx";
import styles from "./SessionNotices.module.css";

/**
 * What the session displayed has to tell or ask: why it is disconnected, and a
 * new participant's name.
 */
export default function SessionNotices() {
  const intl = useIntl();
  const sessionConnectionContext = useSessionConnectionContext();
  if (!sessionConnectionContext) {
    return null;
  }
  const { sessionConnection, sessionConnectionSnapshot } =
    sessionConnectionContext;
  const rename = (name: string) => {
    sessionConnection.rename(name);
    writeStorage(participantNameStorageKey, name);
  };
  return (
    <>
      {sessionConnectionSnapshot.endReason && (
        <div className={styles["banner"]}>
          <EndReasonBanner endReason={sessionConnectionSnapshot.endReason} />
        </div>
      )}
      {sessionConnectionSnapshot.isNewParticipant && (
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
      )}
    </>
  );
}

interface EndReasonBannerProps {
  endReason: SessionEndReason;
}

function EndReasonBanner({ endReason }: EndReasonBannerProps) {
  const intl = useIntl();
  const description = {
    notFound: intl.formatMessage({
      defaultMessage: "The session ended, or expired. Changes aren't saved.",
    }),
    forbidden: intl.formatMessage({
      defaultMessage:
        "This browser can't join the review as before. Changes aren't saved.",
    }),
    tooManyParticipants: intl.formatMessage({
      defaultMessage:
        "The review has too many participants to join it. Changes aren't saved.",
    }),
    stateTooLarge: intl.formatMessage({
      defaultMessage:
        "Your progress is too large to be saved in the session. Changes aren't saved.",
    }),
    failed: intl.formatMessage({
      defaultMessage:
        "The connection to the session failed. Reload the page to try again.",
    }),
  }[endReason];
  return (
    <Banner
      variant="warning"
      title={intl.formatMessage({ defaultMessage: "Not connected" })}
      hideTitle
      description={description}
    />
  );
}
