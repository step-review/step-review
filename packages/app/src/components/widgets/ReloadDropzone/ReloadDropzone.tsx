import { useEffect } from "react";
import { useIntl } from "react-intl";
import loadReview from "../../../business-logic/review/loadReview.ts";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";
import { useShareSessionContext } from "../../../business-logic/share-session/ShareSessionProvider.tsx";
import updateSharedReview from "../../../business-logic/sharing/updateSharedReview.ts";
import FullScreenDropzone from "../../design-system/FullScreenDropzone/FullScreenDropzone.tsx";

/**
 * Accepts a review file dropped anywhere on the page, e.g. after the agent
 * reviewed the PR again. A shared review is updated for every participant, and
 * only by its owner.
 */
export default function ReloadDropzone() {
  const shareSessionContext = useShareSessionContext();
  if (!shareSessionContext) {
    return <LocalReloadDropzone />;
  }
  const { shareBookmark, shareKey } = shareSessionContext;
  const { ownerSecret } = shareBookmark;
  return (
    ownerSecret !== null && (
      <SharedReloadDropzone
        shareBookmark={{ ...shareBookmark, ownerSecret }}
        shareKey={shareKey}
      />
    )
  );
}

function LocalReloadDropzone() {
  const intl = useIntl();
  const { openReviewFile, problems } = useOpenReviewFile();
  useEffect(() => {
    if (problems.length > 0) {
      window.alert(problems.map((problem) => problem.message).join("\n"));
    }
  }, [problems]);
  return (
    <FullScreenDropzone
      label={intl.formatMessage({
        defaultMessage: "Drop the review file to reload it",
      })}
      onDrop={(file) => {
        void openReviewFile(file);
      }}
    />
  );
}

interface SharedReloadDropzoneProps {
  shareBookmark: Parameters<typeof updateSharedReview>[1];
  shareKey: CryptoKey;
}

function SharedReloadDropzone({
  shareBookmark,
  shareKey,
}: SharedReloadDropzoneProps) {
  const intl = useIntl();
  const update = async (file: File) => {
    const result = loadReview(file.name, await file.text());
    if (!result.success) {
      window.alert(
        result.problems.map((problem) => problem.message).join("\n"),
      );
      return;
    }
    try {
      await updateSharedReview(
        window.location.origin,
        shareBookmark,
        shareKey,
        result.loadedReview,
      );
    } catch {
      window.alert(
        intl.formatMessage({
          defaultMessage:
            "The shared review couldn't be updated. Try again later.",
        }),
      );
    }
  };
  return (
    <FullScreenDropzone
      label={intl.formatMessage({
        defaultMessage: "Drop the review file to update the shared review",
      })}
      onDrop={(file) => {
        void update(file);
      }}
    />
  );
}
