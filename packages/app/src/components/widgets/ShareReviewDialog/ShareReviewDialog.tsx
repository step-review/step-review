import {
  Banner,
  Dialog,
  FormControl,
  Stack,
  Text,
  TextInput,
} from "@primer/react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import participantNameMaxLength from "../../../business-logic/participant-state/participantNameMaxLength.ts";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import participantNameStorageKey from "../../../business-logic/share-store/participantNameStorageKey.ts";
import type ShareBookmark from "../../../business-logic/share-store/ShareBookmark.ts";
import createShare from "../../../business-logic/sharing/createShare.ts";
import shareLink from "../../../business-logic/sharing/shareLink.ts";
import readStorage from "../../../business-logic/storage/readStorage.ts";
import writeStorage from "../../../business-logic/storage/writeStorage.ts";
import ShareLinkField from "../ShareLinkField/ShareLinkField.tsx";

interface Props {
  loadedReview: LoadedReview;
  /** The files viewed so far, which the sharer keeps in the shared review. */
  viewedFingerprints: string[];
  onClose: () => void;
}

type Progress =
  | { status: "editing" | "creating" | "failed" }
  | { status: "created"; shareBookmark: ShareBookmark };

/** Shares a review kept in the browser, and gives its link. */
export default function ShareReviewDialog({
  loadedReview,
  viewedFingerprints,
  onClose,
}: Props) {
  const intl = useIntl();
  const [name, setName] = useState(
    () => readStorage(participantNameStorageKey) ?? "",
  );
  const [progress, setProgress] = useState<Progress>({ status: "editing" });
  const share = async () => {
    setProgress({ status: "creating" });
    writeStorage(participantNameStorageKey, name.trim());
    try {
      const shareBookmark = await createShare(
        window.location.origin,
        loadedReview,
        { name, viewedFingerprints },
      );
      setProgress({ status: "created", shareBookmark });
    } catch {
      setProgress({ status: "failed" });
    }
  };
  if (progress.status === "created") {
    const { shareId, shareKey } = progress.shareBookmark;
    return (
      <Dialog
        title={intl.formatMessage({ defaultMessage: "Review shared" })}
        onClose={onClose}
        footerButtons={[
          {
            buttonType: "default",
            content: intl.formatMessage({ defaultMessage: "Close" }),
            onClick: onClose,
          },
          {
            buttonType: "primary",
            content: intl.formatMessage({
              defaultMessage: "Open the shared review",
            }),
            onClick: () =>
              navigateTo({
                name: RouteName.Overview,
                reviewAddress: { kind: "shared", shareId, shareKey },
              }),
          },
        ]}
      >
        <ShareLinkField
          link={shareLink(window.location.origin, progress.shareBookmark)}
        />
      </Dialog>
    );
  }
  const isCreating = progress.status === "creating";
  return (
    <Dialog
      title={intl.formatMessage({ defaultMessage: "Share the review" })}
      onClose={onClose}
      footerButtons={[
        {
          buttonType: "default",
          content: intl.formatMessage({ defaultMessage: "Cancel" }),
          onClick: onClose,
        },
        {
          buttonType: "primary",
          content: intl.formatMessage({ defaultMessage: "Create a link" }),
          loading: isCreating,
          onClick: () => void share(),
        },
      ]}
    >
      <Stack gap="normal">
        <Text as="p">
          <FormattedMessage defaultMessage="The review is encrypted in your browser and uploaded with your progress. Whoever opens its link reviews it with you: you'll see each other's progress, and where you are." />
        </Text>
        <Text as="p">
          <FormattedMessage defaultMessage="The key is in the link only, so the server can't read the review. It is deleted after 30 days without activity." />
        </Text>
        {progress.status === "failed" && (
          <Banner
            variant="critical"
            title={intl.formatMessage({ defaultMessage: "Sharing failed" })}
            hideTitle
            description={
              <FormattedMessage defaultMessage="The review couldn't be uploaded. Try again later." />
            }
          />
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void share();
          }}
        >
          <FormControl disabled={isCreating}>
            <FormControl.Label>
              <FormattedMessage defaultMessage="Your name" />
            </FormControl.Label>
            <TextInput
              block
              autoFocus
              value={name}
              maxLength={participantNameMaxLength}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <FormControl.Caption>
              <FormattedMessage defaultMessage="Shown to the others." />
            </FormControl.Caption>
          </FormControl>
        </form>
      </Stack>
    </Dialog>
  );
}
