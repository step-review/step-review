import { PencilIcon } from "@primer/octicons-react";
import { Banner, IconButton, Link } from "@primer/react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import routeHref from "../../../business-logic/navigation/routeHref.ts";
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
import TruncatedText from "../../design-system/TruncatedText/TruncatedText.tsx";
import ParticipantNameDialog from "../ParticipantNameDialog/ParticipantNameDialog.tsx";
import styles from "./ShareParticipantsPanel.module.css";

/**
 * Who is reviewing a shared review, and where they are; asks a new participant
 * for their name.
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
    shareSession.dispatch({ type: "rename", name });
    writeStorage(participantNameStorageKey, name);
    setIsRenaming(false);
  };
  return (
    <section
      className={styles["panel"]}
      aria-label={intl.formatMessage({ defaultMessage: "Participants" })}
    >
      <div className={styles["heading"]}>
        <FormattedMessage defaultMessage="Participants" />
        <span
          className={styles["status"]}
          data-status={shareSessionSnapshot.connectionStatus}
        >
          {shareSessionSnapshot.connectionStatus === "connected" ? (
            <FormattedMessage defaultMessage="Live" />
          ) : shareSessionSnapshot.connectionStatus === "connecting" ? (
            <FormattedMessage defaultMessage="Connecting…" />
          ) : null}
        </span>
      </div>
      {shareSessionSnapshot.endReason && (
        <EndReasonBanner endReason={shareSessionSnapshot.endReason} />
      )}
      <ul className={styles["list"]}>
        {shareParticipants.map((shareParticipant) => (
          <ParticipantItem
            key={shareParticipant.participantId}
            shareParticipant={shareParticipant}
            onRename={() => setIsRenaming(true)}
          />
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

interface ParticipantItemProps {
  shareParticipant: ShareParticipantView;
  onRename: () => void;
}

function ParticipantItem({ shareParticipant, onRename }: ParticipantItemProps) {
  const intl = useIntl();
  const participantLabel = useParticipantLabel();
  const { reviewAddress, steps } = useCurrentReviewView();
  const label = participantLabel(shareParticipant);
  const [firstStepId] = shareParticipant.stepIds;
  const locationRoute =
    firstStepId === undefined
      ? null
      : firstStepId === null
        ? { name: RouteName.Overview, reviewAddress }
        : { name: RouteName.Step, reviewAddress, stepId: firstStepId };
  const locationText = shareParticipant.stepIds
    .map((stepId) => {
      const step = steps.find((stepView) => stepView.id === stepId);
      return step
        ? intl.formatMessage(
            { defaultMessage: "Step {stepNumber}" },
            { stepNumber: step.number },
          )
        : intl.formatMessage({ defaultMessage: "Overview" });
    })
    .join(", ");
  return (
    <li className={styles["item"]}>
      <InitialsAvatar
        name={shareParticipant.name}
        label={label}
        colorIndex={shareParticipant.colorIndex}
        isDimmed={!shareParticipant.isOnline}
      />
      <span className={styles["name"]}>
        <TruncatedText tooltip={label}>{label}</TruncatedText>
      </span>
      <span className={styles["location"]}>
        {shareParticipant.isSelf ? (
          <IconButton
            variant="invisible"
            size="small"
            icon={PencilIcon}
            aria-label={intl.formatMessage({
              defaultMessage: "Change your name",
            })}
            onClick={onRename}
          />
        ) : locationRoute ? (
          <Link
            href={routeHref(locationRoute)}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(locationRoute);
            }}
          >
            {locationText}
          </Link>
        ) : shareParticipant.isOnline ? (
          <FormattedMessage defaultMessage="Online" />
        ) : (
          <FormattedMessage defaultMessage="Away" />
        )}
      </span>
    </li>
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
