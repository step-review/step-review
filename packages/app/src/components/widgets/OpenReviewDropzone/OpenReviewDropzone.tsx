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
  const { openReviewFile, invalidReviewFile } = useOpenReviewFile();
  useEffect(() => {
    if (invalidReviewFile) {
      window.alert(
        invalidReviewFile.problems.map((problem) => problem.message).join("\n"),
      );
    }
  }, [invalidReviewFile]);
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
