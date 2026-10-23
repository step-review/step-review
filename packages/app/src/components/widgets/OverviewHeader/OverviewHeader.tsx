import { BranchName, Heading, Link, Stack } from "@primer/react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import styles from "./OverviewHeader.module.css";

export default function OverviewHeader() {
  const { data, diff } = useCurrentReviewView();
  const { target, createdAt } = data;
  const additions = diff.reduce((sum, fileDiff) => sum + fileDiff.additions, 0);
  const deletions = diff.reduce((sum, fileDiff) => sum + fileDiff.deletions, 0);
  const noteCount = data.steps.reduce(
    (sum, step) =>
      sum +
      (step.notes?.length ?? 0) +
      step.files.reduce(
        (fileSum, stepFile) => fileSum + (stepFile.notes?.length ?? 0),
        0,
      ),
    0,
  );
  return (
    <Stack gap="condensed">
      <div className={styles["eyebrow"]}>
        <FormattedMessage
          defaultMessage="Overview · {date}"
          values={{
            date: (
              <FormattedDate
                value={createdAt}
                dateStyle="medium"
                timeStyle="short"
              />
            ),
          }}
        />
      </div>
      <Heading as="h1" variant="large">
        {target.title}
      </Heading>
      <div className={styles["meta"]}>
        {target.url && (
          <Link href={target.url} target="_blank" rel="noreferrer">
            {target.url}
          </Link>
        )}
        <span className={styles["refs"]}>
          {target.baseRef && (
            <BranchName as="span">{target.baseRef}</BranchName>
          )}
          <code className={styles["commit"]}>
            {target.baseCommit.slice(0, 7)}
          </code>
          →
          {target.headRef && (
            <BranchName as="span">{target.headRef}</BranchName>
          )}
          <code className={styles["commit"]}>
            {target.headCommit.slice(0, 7)}
          </code>
        </span>
      </div>
      <div className={styles["stats"]}>
        <span>
          <FormattedMessage
            defaultMessage="{fileCount, plural, one {# file} other {# files}}"
            values={{ fileCount: diff.length }}
          />
        </span>
        <span className={styles["additions"]}>+{additions}</span>
        <span className={styles["deletions"]}>−{deletions}</span>
        <span>
          <FormattedMessage
            defaultMessage="{noteCount, plural, one {# note} other {# notes}}"
            values={{ noteCount }}
          />
        </span>
      </div>
    </Stack>
  );
}
