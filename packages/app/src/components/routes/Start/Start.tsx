import { MarkGithubIcon, ShieldLockIcon } from "@primer/octicons-react";
import { Banner, Heading, IconButton, Stack, Text } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import hasAddedReview from "../../../business-logic/review-store/hasAddedReview.ts";
import useStoredReviews from "../../../business-logic/review-store/useStoredReviews.ts";
import useSessionBookmarks from "../../../business-logic/session-store/useSessionBookmarks.ts";
import AppBrand from "../../widgets/AppBrand/AppBrand.tsx";
import AppVersion from "../../widgets/AppVersion/AppVersion.tsx";
import ExampleReviewLink from "../../widgets/ExampleReviewLink/ExampleReviewLink.tsx";
import PromptGenerator from "../../widgets/PromptGenerator/PromptGenerator.tsx";
import ReviewDropzone from "../../widgets/ReviewDropzone/ReviewDropzone.tsx";
import RouteLink from "../../widgets/RouteLink/RouteLink.tsx";
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
 * Walks new users through the steps, with the example review. Users who added a
 * review get just what they work with, even after removing their reviews.
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
  const isNewUser = !hasStoredReviews && !hasAddedReview();
  return (
    <div className={styles["page"]}>
      <div className={styles["content"]} data-new-user={isNewUser || undefined}>
        <Stack
          gap="spacious"
          className={styles["steps"]}
          data-new-user={isNewUser || undefined}
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
          {isNewUser && (
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
              {isNewUser ? (
                <FormattedMessage defaultMessage="1. Give this prompt to your agent" />
              ) : (
                <FormattedMessage defaultMessage="Prompt" />
              )}
            </Heading>
            <PromptGenerator editable={!isNewUser} />
          </Stack>
          <Stack gap="condensed">
            <Heading as="h2" variant="small" className={styles["stepHeading"]}>
              {isNewUser ? (
                <FormattedMessage defaultMessage="2. Open the review file it produces" />
              ) : (
                <FormattedMessage defaultMessage="Review file" />
              )}
            </Heading>
            <ReviewDropzone />
          </Stack>
          {isNewUser ? (
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
          ) : (
            <Stack gap="condensed" className={styles["pastReviews"]}>
              <Heading as="h2" variant="small">
                <FormattedMessage defaultMessage="Past reviews" />
              </Heading>
              {hasStoredReviews ? (
                <StoredReviewList
                  storedReviews={storedReviews}
                  sessionBookmarks={sessionBookmarks}
                />
              ) : (
                <Text as="p" className={styles["noPastReviews"]}>
                  <FormattedMessage defaultMessage="The reviews you open are kept here." />
                </Text>
              )}
            </Stack>
          )}
        </Stack>
        <footer className={styles["footer"]}>
          <AppBrand />
          <div className={styles["footerLinks"]}>
            <AppVersion />
            <IconButton
              as={RouteLink}
              route={{ name: RouteName.Privacy }}
              variant="invisible"
              icon={ShieldLockIcon}
              aria-label={intl.formatMessage({ defaultMessage: "Privacy" })}
            />
            <IconButton
              as="a"
              href="https://github.com/step-review/step-review"
              target="_blank"
              rel="noreferrer"
              variant="invisible"
              icon={MarkGithubIcon}
              aria-label={intl.formatMessage({
                defaultMessage: "Step Review on GitHub",
              })}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
