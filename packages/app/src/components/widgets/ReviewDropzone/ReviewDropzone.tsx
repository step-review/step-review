import { UploadIcon } from "@primer/octicons-react";
import { Banner, Button, Stack } from "@primer/react";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import createFixPrompt from "../../../business-logic/prompts/createFixPrompt.ts";
import useOpenReviewFile from "../../../business-logic/review/useOpenReviewFile.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import FullScreenDropzone from "../../design-system/FullScreenDropzone/FullScreenDropzone.tsx";
import HiddenFileInput from "../../design-system/HiddenFileInput/HiddenFileInput.tsx";
import styles from "./ReviewDropzone.module.css";

/**
 * Opens a review file chosen with the button or dropped anywhere on the page,
 * and shows why it can't be opened if it's not a valid review.
 */
export default function ReviewDropzone() {
  const intl = useIntl();
  const { openReviewFile, invalidReviewFile } = useOpenReviewFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <Stack gap="condensed">
      <div className={styles["actions"]}>
        <HiddenFileInput
          ref={fileInputRef}
          onChange={(file) => {
            void openReviewFile(file);
          }}
        />
        <Button
          size="medium"
          leadingVisual={UploadIcon}
          onClick={() => fileInputRef.current?.click()}
        >
          <FormattedMessage defaultMessage="Open file" />
        </Button>
        <span className={styles["hint"]}>
          <FormattedMessage defaultMessage="or drop it anywhere on this page" />
        </span>
      </div>
      <FullScreenDropzone
        label={intl.formatMessage({
          defaultMessage: "Drop the review file to open it",
        })}
        onDrop={(file) => {
          void openReviewFile(file);
        }}
      />
      {invalidReviewFile && (
        <Banner variant="critical">
          <Banner.Title className={styles["problemsTitle"]}>
            <FormattedMessage defaultMessage="The file is not a valid review" />
            <CopyIconButton
              value={createFixPrompt(
                window.location.origin,
                invalidReviewFile.fileName,
                invalidReviewFile.problems.map((problem) =>
                  problem.location
                    ? `${problem.location}: ${problem.message}`
                    : problem.message,
                ),
              )}
              label={intl.formatMessage({
                defaultMessage: "Copy for your agent",
              })}
            />
          </Banner.Title>
          <Banner.Description>
            <ul className={styles["problems"]}>
              {invalidReviewFile.problems.map((problem, index) => (
                <li key={index}>
                  {problem.location && (
                    <span className={styles["location"]}>
                      {problem.location}:{" "}
                    </span>
                  )}
                  {problem.message}
                </li>
              ))}
            </ul>
          </Banner.Description>
        </Banner>
      )}
    </Stack>
  );
}
