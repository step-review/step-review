import { useEffect } from "react";
import { useIntl } from "react-intl";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";
import FullScreenDropzone from "../../design-system/FullScreenDropzone/FullScreenDropzone.tsx";

/**
 * Accepts a review file dropped anywhere on the page, e.g. after the agent
 * reviewed the PR again.
 */
export default function ReloadDropzone() {
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
