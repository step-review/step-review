import { Banner, Tooltip } from "@primer/react";
import { useState } from "react";
import { useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import type ShareParticipantView from "../../../business-logic/share-participants/ShareParticipantView.ts";
import useParticipantLabel from "../../../business-logic/share-participants/useParticipantLabel.ts";
import useShareParticipants from "../../../business-logic/share-participants/useShareParticipants.ts";
import type ShareEndReason from "../../../business-logic/share-session/ShareEndReason.ts";
import { useShareSessionContext } from "../../../business-logic/share-session/ShareSessionProvider.tsx";
import participantNameStorageKey from "../../../business-logic/share-store/participantNameStorageKey.ts";
import readStorage from "../../../business-logic/storage/readStorage.ts";
import writeStorage from "../../../business-logic/storage/writeStorage.ts";
import InitialsAvatar from "../../design-system/InitialsAvatar/InitialsAvatar.tsx";
import ParticipantNameDialog from "../ParticipantNameDialog/ParticipantNameDialog.tsx";
import styles from "./ShareParticipantsPanel.module.css";

/**
 * Who is reviewing a shared review, as a row of avatars, the own one first;
 * asks a new participant for their name.
 */
export default function ShareParticipantsPanel() {
  const intl = useIntl();
  const shareSessionContext = useShareSessionContext();
  const shareParticipants = useShareParticipants();
  const [isRenaming, setIsRenaming] = useState(false);
  if (!shareSessionContext || !shareParticipants) {
    return null;
  }
  const { shareSession, shareSessionSnapshot } = shareSessionContext;
  const rename = (name: string) => {
    shareSession.rename(name);
    writeStorage(participantNameStorageKey, name);
    setIsRenaming(false);
  };
  return (
    <section
      className={styles["panel"]}
      aria-label={intl.formatMessage({ defaultMessage: "Participants" })}
    >
      {shareSessionSnapshot.endReason && (
        <EndReasonBanner endReason={shareSessionSnapshot.endReason} />
      )}
      <ul className={styles["list"]}>
        {shareParticipants.map((shareParticipant) => (
          <li key={shareParticipant.participantId}>
            <ParticipantButton
              shareParticipant={shareParticipant}
              onRename={() => setIsRenaming(true)}
            />
          </li>
        ))}
      </ul>
      {shareSessionSnapshot.isNewParticipant && (
        <ParticipantNameDialog
          title={intl.formatMessage({ defaultMessage: "Join the review" })}
          description={intl.formatMessage({
            defaultMessage:
              "The other participants will see your name, the files you viewed, and where you are.",
          })}
          submitLabel={intl.formatMessage({ defaultMessage: "Join" })}
          initialName={readStorage(participantNameStorageKey) ?? ""}
          onSubmit={rename}
          // Joins without a name, so that it isn't asked again.
          onClose={() => rename("")}
        />
      )}
      {isRenaming && (
        <ParticipantNameDialog
          title={intl.formatMessage({ defaultMessage: "Change your name" })}
          description={intl.formatMessage({
            defaultMessage: "The other participants will see the new name.",
          })}
          submitLabel={intl.formatMessage({ defaultMessage: "Save" })}
          initialName={shareSessionSnapshot.ownState.name}
          onSubmit={rename}
          onClose={() => setIsRenaming(false)}
        />
      )}
    </section>
  );
}

interface ParticipantButtonProps {
  shareParticipant: ShareParticipantView;
  onRename: () => void;
}

/**
 * A participant's avatar, named on hover. Clicking the own one renames;
 * another's follows them to their step and file, if they are on one.
 */
function ParticipantButton({
  shareParticipant,
  onRename,
}: ParticipantButtonProps) {
  const participantLabel = useParticipantLabel();
  const { reviewAddress } = useCurrentReviewView();
  const label = participantLabel(shareParticipant);
  // Follows the first tab, to its step and file.
  const [firstLocation] = shareParticipant.locations;
  const follow =
    firstLocation &&
    (() =>
      navigateTo(
        firstLocation.stepId === null
          ? { name: RouteName.Overview, reviewAddress }
          : {
              name: RouteName.Step,
              reviewAddress,
              stepId: firstLocation.stepId,
            },
        firstLocation.fileId ? `file-${firstLocation.fileId}` : undefined,
      ));
  const onClick = shareParticipant.isSelf ? onRename : follow;
  return (
    <Tooltip text={label} type="label" direction="n">
      <button
        type="button"
        className={styles["avatarButton"]}
        aria-disabled={!onClick || undefined}
        onClick={onClick}
      >
        <InitialsAvatar
          name={shareParticipant.name}
          label={label}
          colorIndex={shareParticipant.colorIndex}
          isDimmed={!shareParticipant.isOnline}
        />
      </button>
    </Tooltip>
  );
}

interface EndReasonBannerProps {
  endReason: ShareEndReason;
}

function EndReasonBanner({ endReason }: EndReasonBannerProps) {
  const intl = useIntl();
  const description = {
    notFound: intl.formatMessage({
      defaultMessage:
        "The review is no longer shared: it was deleted, or expired. Changes aren't saved.",
    }),
    forbidden: intl.formatMessage({
      defaultMessage:
        "This browser can't join the review as before. Changes aren't saved.",
    }),
    tooManyParticipants: intl.formatMessage({
      defaultMessage:
        "The review has too many participants to join it. Changes aren't saved.",
    }),
    failed: intl.formatMessage({
      defaultMessage:
        "The connection to the shared review failed. Reload the page to try again.",
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
