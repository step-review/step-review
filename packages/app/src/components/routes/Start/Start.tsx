import { Banner, Heading, Stack, Text } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import useStoredReviews from "../../../business-logic/review-store/useStoredReviews.ts";
import AppBrand from "../../widgets/AppBrand/AppBrand.tsx";
import ExampleReviewLink from "../../widgets/ExampleReviewLink/ExampleReviewLink.tsx";
import PromptGenerator from "../../widgets/PromptGenerator/PromptGenerator.tsx";
import ReviewDropzone from "../../widgets/ReviewDropzone/ReviewDropzone.tsx";
import StoredReviewList from "../../widgets/StoredReviewList/StoredReviewList.tsx";
import styles from "./Start.module.css";

interface Props {
  /** Set when a review page was opened for a review that isn't stored. */
  isReviewMissing?: boolean;
}

/**
 * Walks new users through the steps, with the example review. Users with stored
 * reviews get just what they work with.
 */
export default function Start({ isReviewMissing = false }: Props) {
  const intl = useIntl();
  const storedReviews = useStoredReviews();
  // Being read from the browser's storage, which takes a moment.
  if (storedReviews === undefined) {
    return null;
  }
  const hasStoredReviews = storedReviews.length > 0;
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
          {isReviewMissing && (
            <Banner
              variant="info"
              title={intl.formatMessage({ defaultMessage: "Review not found" })}
              hideTitle
              description={
                <FormattedMessage defaultMessage="This review isn't saved in this browser. Open its file to continue." />
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
              <StoredReviewList storedReviews={storedReviews} />
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
