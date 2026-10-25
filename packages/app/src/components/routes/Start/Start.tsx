import { Banner, Heading, Stack, Text } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import useStoredReviews from "../../../business-logic/review-store/useStoredReviews.ts";
import useSessionBookmarks from "../../../business-logic/session-store/useSessionBookmarks.ts";
import AppBrand from "../../widgets/AppBrand/AppBrand.tsx";
import ExampleReviewLink from "../../widgets/ExampleReviewLink/ExampleReviewLink.tsx";
import PromptGenerator from "../../widgets/PromptGenerator/PromptGenerator.tsx";
import ReviewDropzone from "../../widgets/ReviewDropzone/ReviewDropzone.tsx";
import StoredReviewList from "../../widgets/StoredReviewList/StoredReviewList.tsx";
import styles from "./Start.module.css";

interface Props {
  /**
   * Set when a review page was opened for a review that can't be loaded: one
   * that isn't stored, or a session that doesn't exist (anymore).
   */
  missingReview?: "local" | "session";
}

/**
 * Walks new users through the steps, with the example review. Users with stored
 * reviews get just what they work with.
 */
export default function Start({ missingReview }: Props) {
  const intl = useIntl();
  const storedReviews = useStoredReviews();
  const sessionBookmarks = useSessionBookmarks();
  // Being read from the browser's storage, which takes a moment.
  if (storedReviews === undefined || sessionBookmarks === undefined) {
    return null;
  }
  const hasStoredReviews =
    storedReviews.length > 0 || sessionBookmarks.length > 0;
  return (
    <div className={styles["page"]}>
      <div
        className={styles["content"]}
        data-new-user={!hasStoredReviews || undefined}
      >
        <Stack
          gap="spacious"
          className={styles["steps"]}
          data-new-user={!hasStoredReviews || undefined}
        >
          {missingReview && (
            <Banner
              variant="info"
              title={intl.formatMessage({ defaultMessage: "Review not found" })}
              hideTitle
              description={
                missingReview === "local" ? (
                  <FormattedMessage defaultMessage="This review isn't saved in this browser. Open its file to continue." />
                ) : (
                  <FormattedMessage defaultMessage="This session can't be joined: it ended or expired, or its link is incomplete." />
                )
              }
            />
          )}
          {!hasStoredReviews && (
            <Stack gap="normal" className={styles["intro"]}>
              <Text as="p">
                <FormattedMessage
                  defaultMessage="When AI writes the code, <strong>PRs get too large to read in full</strong>."
                  values={{ strong: (chunks) => <strong>{chunks}</strong> }}
                />
              </Text>
              <Text as="p">
                <FormattedMessage
                  defaultMessage="Step Review <strong>breaks them down into logical steps</strong>, so you can <strong>actually understand them</strong>, and keep a handle on your codebase. Try it:"
                  values={{ strong: (chunks) => <strong>{chunks}</strong> }}
                />
              </Text>
            </Stack>
          )}
          <Stack gap="condensed">
            <Heading as="h2" variant="small" className={styles["stepHeading"]}>
              {hasStoredReviews ? (
                <FormattedMessage defaultMessage="Prompt" />
              ) : (
                <FormattedMessage defaultMessage="1. Give this prompt to your agent" />
              )}
            </Heading>
            <PromptGenerator editable={hasStoredReviews} />
          </Stack>
          <Stack gap="condensed">
            <Heading as="h2" variant="small" className={styles["stepHeading"]}>
              {hasStoredReviews ? (
                <FormattedMessage defaultMessage="Review file" />
              ) : (
                <FormattedMessage defaultMessage="2. Open the review file it produces" />
              )}
            </Heading>
            <ReviewDropzone />
          </Stack>
          {hasStoredReviews ? (
            <Stack gap="condensed" className={styles["pastReviews"]}>
              <Heading as="h2" variant="small">
                <FormattedMessage defaultMessage="Past reviews" />
              </Heading>
              <StoredReviewList
                storedReviews={storedReviews}
                sessionBookmarks={sessionBookmarks}
              />
            </Stack>
          ) : (
            <Heading as="h2" variant="small" className={styles["stepHeading"]}>
              <FormattedMessage
                defaultMessage="3. Go through the PR ({exampleLink})"
                values={{
                  exampleLink: (
                    <ExampleReviewLink>
                      <FormattedMessage defaultMessage="see example" />
                    </ExampleReviewLink>
                  ),
                }}
              />
            </Heading>
          )}
        </Stack>
        <footer className={styles["brand"]}>
          <AppBrand />
        </footer>
      </div>
    </div>
  );
}
