import { useEffect } from "react";
import { useIntl } from "react-intl";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";
import FullScreenDropzone from "../../design-system/FullScreenDropzone/FullScreenDropzone.tsx";

/**
 * Opens a review file dropped anywhere on a review's page, kept in the browser
 * as a review of its own, even from a session.
 */
export default function OpenReviewDropzone() {
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
        defaultMessage: "Drop the review file to open it",
      })}
      onDrop={(file) => {
        void openReviewFile(file);
      }}
    />
  );
}
