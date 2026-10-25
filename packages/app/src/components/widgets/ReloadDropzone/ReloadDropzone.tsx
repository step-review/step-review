import { useEffect } from "react";
import { useIntl } from "react-intl";
import loadReview from "../../../business-logic/review/loadReview.ts";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";
import { useSessionConnectionContext } from "../../../business-logic/session-connection/SessionConnectionProvider.tsx";
import updateSessionReview from "../../../business-logic/session/updateSessionReview.ts";
import FullScreenDropzone from "../../design-system/FullScreenDropzone/FullScreenDropzone.tsx";

/**
 * Accepts a review file dropped anywhere on the page, e.g. after the agent
 * reviewed the PR again. A session's review is updated for every participant,
 * and only by its owner.
 */
export default function ReloadDropzone() {
  const sessionConnectionContext = useSessionConnectionContext();
  if (!sessionConnectionContext) {
    return <LocalReloadDropzone />;
  }
  const { sessionBookmark, sessionKey } = sessionConnectionContext;
  const { ownerSecret } = sessionBookmark;
  return (
    ownerSecret !== null && (
      <SessionReloadDropzone
        sessionBookmark={{ ...sessionBookmark, ownerSecret }}
        sessionKey={sessionKey}
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

interface SessionReloadDropzoneProps {
  sessionBookmark: Parameters<typeof updateSessionReview>[1];
  sessionKey: CryptoKey;
}

function SessionReloadDropzone({
  sessionBookmark,
  sessionKey,
}: SessionReloadDropzoneProps) {
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
      await updateSessionReview(
        window.location.origin,
        sessionBookmark,
        sessionKey,
        result.loadedReview,
      );
    } catch {
      window.alert(
        intl.formatMessage({
          defaultMessage:
            "The review couldn't be updated for the session. Try again later.",
        }),
      );
    }
  };
  return (
    <FullScreenDropzone
      label={intl.formatMessage({
        defaultMessage: "Drop the review file to update it for the session",
      })}
      onDrop={(file) => {
        void update(file);
      }}
    />
  );
}
