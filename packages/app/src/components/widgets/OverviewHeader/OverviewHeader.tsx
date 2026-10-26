import { BranchName, Heading, Link, Stack } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import formatTargetUrl from "../../../business-logic/review-target/formatTargetUrl.ts";
import collectNotes from "../../../business-logic/review-view/collectNotes.ts";
import countNotes from "../../../business-logic/review-view/countNotes.ts";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import NoteCounts from "../../design-system/NoteCounts/NoteCounts.tsx";
import styles from "./OverviewHeader.module.css";

export default function OverviewHeader() {
  const intl = useIntl();
  const { data, diff, steps } = useCurrentReviewView();
  const { target } = data;
  const additions = diff.reduce((sum, fileDiff) => sum + fileDiff.additions, 0);
  const deletions = diff.reduce((sum, fileDiff) => sum + fileDiff.deletions, 0);
  const noteKindCounts = countNotes(collectNotes(steps));
  return (
    <Stack gap="condensed">
      <div>
        {target.url && (
          <div className={styles["targetLabel"]}>
            <FormattedMessage
              defaultMessage="Review for {link}"
              values={{
                link: (
                  <Link href={target.url} target="_blank" rel="noreferrer">
                    {formatTargetUrl(target.url)}
                  </Link>
                ),
              }}
            />
          </div>
        )}
        <Heading as="h1" variant="large">
          {target.title}
        </Heading>
      </div>
      <div className={styles["stats"]}>
        <span>
          <FormattedMessage
            defaultMessage="{fileCount, plural, one {# file} other {# files}}"
            values={{ fileCount: diff.length }}
          />
        </span>
        <span className={styles["lineCounts"]}>
          <span className={styles["additions"]}>+{additions}</span>
          <span className={styles["deletions"]}>−{deletions}</span>
        </span>
        <NoteCounts {...noteKindCounts} />
        {(Boolean(target.baseRef) || Boolean(target.headRef)) && (
          <span className={styles["refs"]}>
            {target.baseRef && (
              <BranchName as="span">{target.baseRef}</BranchName>
            )}
            {target.baseRef && target.headRef && "→"}
            {target.headRef && (
              <span className={styles["branch"]}>
                <BranchName as="span">{target.headRef}</BranchName>
                <CopyIconButton
                  value={target.headRef}
                  label={intl.formatMessage(
                    {
                      defaultMessage: 'Copy "{branchName}"',
                    },
                    { branchName: target.headRef },
                  )}
                />
              </span>
            )}
          </span>
        )}
      </div>
    </Stack>
  );
}
