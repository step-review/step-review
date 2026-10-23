import { Banner } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import type LoadedReview from "../../../business-logic/review/LoadedReview.ts";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import Markdown from "../../design-system/Markdown/Markdown.tsx";
import styles from "./ReviewWarnings.module.css";

interface Props {
  loadedReview: LoadedReview;
}

/** Problems in the review file that the agent should fix. */
export default function ReviewWarnings({ loadedReview }: Props) {
  const intl = useIntl();
  const { warnings } = loadedReview;
  if (warnings.length === 0) {
    return null;
  }
  const warningsText = [
    `The review in \`${loadedReview.fileName}\` has these problems. Fix them:`,
    ...warnings.map((warning) => `- ${warning}`),
  ].join("\n");
  return (
    <Banner variant="warning">
      <Banner.Title className={styles["title"]}>
        <FormattedMessage
          defaultMessage="{warningCount, plural, one {The review has # problem} other {The review has # problems}}"
          values={{ warningCount: warnings.length }}
        />
        <CopyIconButton
          value={warningsText}
          label={intl.formatMessage({
            defaultMessage: "Copy for your agent",
          })}
        />
      </Banner.Title>
      <Banner.Description>
        <ul className={styles["warnings"]}>
          {warnings.map((warning, index) => (
            <li key={index}>
              <Markdown>{warning}</Markdown>
            </li>
          ))}
        </ul>
      </Banner.Description>
    </Banner>
  );
}
