import { Banner, Heading, Stack, Text } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import useStoredReviews from "../../../business-logic/review-store/useStoredReviews.ts";
import Logo from "../../design-system/Logo/Logo.tsx";
import ExampleReviewLink from "../../widgets/ExampleReviewLink/ExampleReviewLink.tsx";
import ExampleReviewPreview from "../../widgets/ExampleReviewPreview/ExampleReviewPreview.tsx";
import ProjectCredits from "../../widgets/ProjectCredits/ProjectCredits.tsx";
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
      <header className={styles["header"]}>
        <div className={styles["brand"]}>
          {/* Twice the title's size, as in the sidebar. */}
          <Logo size={40} />
          <div>
            <Heading as="h1" variant="medium" className={styles["title"]}>
              Step Review
            </Heading>
            <Text as="p" size="large" className={styles["tagline"]}>
              <FormattedMessage defaultMessage="A better way to review PRs" />
            </Text>
          </div>
        </div>
        <ProjectCredits size="large" />
      </header>
      <Stack gap="spacious" className={styles["content"]}>
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
        <Stack gap="condensed">
          <Heading as="h2" variant="small">
            {hasStoredReviews ? (
              <FormattedMessage defaultMessage="Prompt" />
            ) : (
              <FormattedMessage defaultMessage="1. Send this prompt" />
            )}
          </Heading>
          <PromptGenerator />
        </Stack>
        <Stack gap="condensed">
          <Heading as="h2" variant="small">
            {hasStoredReviews ? (
              <FormattedMessage defaultMessage="Review file" />
            ) : (
              <FormattedMessage defaultMessage="2. Open the review file" />
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
          <Stack gap="condensed" className={styles["exampleSection"]}>
            <Heading as="h2" variant="small">
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
            <div className={styles["example"]}>
              <ExampleReviewPreview />
            </div>
          </Stack>
        )}
      </Stack>
    </div>
  );
}
