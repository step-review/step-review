import { Heading, Stack } from "@primer/react";
import { FormattedMessage } from "react-intl";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import styles from "./OverviewSummary.module.css";

export default function OverviewSummary() {
  const { overview } = useCurrentReviewView().data;
  return (
    <Stack gap="normal" className={styles["summary"]}>
      <ReviewMarkdown size="large">{overview.summary}</ReviewMarkdown>
      {overview.readingPlan && (
        <div>
          <Heading
            as="h2"
            variant="small"
            className={styles["readingPlanTitle"]}
          >
            <FormattedMessage defaultMessage="How to read this review" />
          </Heading>
          <ReviewMarkdown size="large">{overview.readingPlan}</ReviewMarkdown>
        </div>
      )}
    </Stack>
  );
}
