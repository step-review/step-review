import { Banner, Heading, Stack, Text } from "@primer/react";
import { FormattedMessage, useIntl } from "react-intl";
import Logo from "../../design-system/Logo/Logo.tsx";
import ExampleReviewLink from "../../widgets/ExampleReviewLink/ExampleReviewLink.tsx";
import ExampleReviewPreview from "../../widgets/ExampleReviewPreview/ExampleReviewPreview.tsx";
import PromptGenerator from "../../widgets/PromptGenerator/PromptGenerator.tsx";
import ReviewDropzone from "../../widgets/ReviewDropzone/ReviewDropzone.tsx";
import styles from "./Start.module.css";

interface Props {
  /** Set when a review page was opened without a loaded review. */
  isReviewMissing?: boolean;
}

export default function Start({ isReviewMissing = false }: Props) {
  const intl = useIntl();
  return (
    <div className={styles["page"]}>
      <header className={styles["header"]}>
        <Logo size={56} />
        <div>
          <Heading as="h1" variant="medium" className={styles["title"]}>
            Step Review
          </Heading>
          <Text as="p" size="large" className={styles["tagline"]}>
            <FormattedMessage defaultMessage="A better way to review PRs" />
          </Text>
        </div>
      </header>
      <Stack gap="spacious" className={styles["content"]}>
        {isReviewMissing && (
          <Banner
            variant="info"
            title={intl.formatMessage({ defaultMessage: "Review not loaded" })}
            hideTitle
            description={
              <FormattedMessage defaultMessage="Load the review file again to continue where you were." />
            }
          />
        )}
        <Stack gap="condensed">
          <Heading as="h2" variant="small">
            <FormattedMessage defaultMessage="1. Send this prompt" />
          </Heading>
          <PromptGenerator />
        </Stack>
        <Stack gap="condensed">
          <Heading as="h2" variant="small">
            <FormattedMessage defaultMessage="2. Open the review file" />
          </Heading>
          <ReviewDropzone />
        </Stack>
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
      </Stack>
    </div>
  );
}
