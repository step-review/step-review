import { AlertIcon } from "@primer/octicons-react";
import { Banner } from "@primer/react";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import type { IntlShape } from "react-intl";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import type SessionEndReason from "../../../business-logic/session-connection/SessionEndReason.ts";
import AnchoredTooltip from "../../design-system/AnchoredTooltip/AnchoredTooltip.tsx";
import styles from "./SessionNotices.module.css";

interface Props {
  /** An icon with the notice as tooltip, for the sidebar's rail. */
  isCompact?: boolean;
}

/** What the session displayed has to tell: why it is disconnected. */
export default function SessionNotices({ isCompact = false }: Props) {
  const intl = useIntl();
  const endReason =
    useSessionConnectionContext()?.sessionConnectionSnapshot.endReason;
  if (!endReason) {
    return null;
  }
  const title = intl.formatMessage({ defaultMessage: "Not connected" });
  const description = describeEndReason(intl, endReason);
  return isCompact ? (
    <EndReasonIcon
      label={intl.formatMessage(
        { defaultMessage: "{title}: {description}" },
        { title, description },
      )}
    />
  ) : (
    <div className={styles["banner"]}>
      <Banner
        variant="warning"
        title={title}
        hideTitle
        description={description}
      />
    </div>
  );
}

interface EndReasonIconProps {
  label: string;
}

function EndReasonIcon({ label }: EndReasonIconProps) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  return (
    <>
      <span
        ref={iconRef}
        role="img"
        aria-label={label}
        className={styles["icon"]}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        <AlertIcon />
      </span>
      <AnchoredTooltip
        anchorRef={iconRef}
        isOpen={isTooltipOpen}
        text={label}
        side="outside-right"
      />
    </>
  );
}

function describeEndReason(
  intl: IntlShape,
  endReason: SessionEndReason,
): string {
  return {
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
}
