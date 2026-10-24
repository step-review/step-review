import { Dialog } from "@primer/react";
import { useIntl } from "react-intl";
import type ShareBookmark from "../../../business-logic/share-store/ShareBookmark.ts";
import shareLink from "../../../business-logic/sharing/shareLink.ts";
import ShareLinkField from "../ShareLinkField/ShareLinkField.tsx";

interface Props {
  shareBookmark: ShareBookmark;
  onClose: () => void;
}

/** The link of a shared review, to invite more participants. */
export default function ShareLinkDialog({ shareBookmark, onClose }: Props) {
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
      <ShareLinkField link={shareLink(window.location.origin, shareBookmark)} />
    </Dialog>
  );
}
