import { Heading, Stack } from "@primer/react";
import { FormattedMessage } from "react-intl";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import styles from "./OverviewSummary.module.css";

export default function OverviewSummary() {
  const { overview } = useCurrentReviewView().data;
  return (
    <Stack gap="normal">
      <ReviewMarkdown>{overview.summary}</ReviewMarkdown>
      {overview.areas && overview.areas.length > 0 && (
        <div className={styles["areas"]}>
          {overview.areas.map((area, index) => (
            <section key={index} className={styles["area"]}>
              <Heading as="h3" variant="small" className={styles["areaTitle"]}>
                {area.title}
              </Heading>
              <ul className={styles["points"]}>
                {area.points.map((point, pointIndex) => (
                  <li key={pointIndex}>
                    <ReviewMarkdown>{point}</ReviewMarkdown>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      {overview.readingPlan && (
        <div>
          <Heading
            as="h2"
            variant="small"
            className={styles["readingPlanTitle"]}
          >
            <FormattedMessage defaultMessage="How to read this review" />
          </Heading>
          <ReviewMarkdown>{overview.readingPlan}</ReviewMarkdown>
        </div>
      )}
    </Stack>
  );
}
