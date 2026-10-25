import { Dialog } from "@primer/react";
import { useIntl } from "react-intl";
import type SessionBookmark from "../../../business-logic/session-store/SessionBookmark.ts";
import sessionLink from "../../../business-logic/session/sessionLink.ts";
import SessionLinkField from "../SessionLinkField/SessionLinkField.tsx";

interface Props {
  sessionBookmark: SessionBookmark;
  onClose: () => void;
}

/** The link of a session, to invite more participants. */
export default function SessionLinkDialog({ sessionBookmark, onClose }: Props) {
  const intl = useIntl();
  return (
    <Dialog
      title={intl.formatMessage({ defaultMessage: "Invite to the review" })}
      onClose={onClose}
      footerButtons={[
        {
          buttonType: "primary",
          content: intl.formatMessage({ defaultMessage: "Done" }),
          onClick: onClose,
        },
      ]}
    >
      <SessionLinkField
        link={sessionLink(window.location.origin, sessionBookmark)}
      />
    </Dialog>
  );
}
