import { Alert, Container, Group, Stack, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { FormattedMessage } from "react-intl";
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
  return (
    <div className={styles["page"]}>
      <Group
        component="header"
        justify="center"
        gap="md"
        wrap="nowrap"
        className={styles["header"]}
      >
        <Logo size={56} />
        <div>
          <Title order={2} lh={1.2}>
            Step Review
          </Title>
          <Text size="lg" c="dimmed" lh={1.3}>
            <FormattedMessage defaultMessage="A better way to review PRs" />
          </Text>
        </div>
      </Group>
      <Container size={696} className={styles["container"]}>
        <Stack gap={32} className={styles["content"]}>
          {isReviewMissing && (
            <Alert icon={<IconInfoCircle />}>
              <FormattedMessage defaultMessage="Load the review file again to continue where you were." />
            </Alert>
          )}
          <Stack gap="sm">
            <Title order={4}>
              <FormattedMessage defaultMessage="1. Send this prompt" />
            </Title>
            <PromptGenerator />
          </Stack>
          <Stack gap="sm">
            <Title order={4}>
              <FormattedMessage defaultMessage="2. Open the review file" />
            </Title>
            <ReviewDropzone />
          </Stack>
          <Stack gap="sm" className={styles["exampleSection"]}>
            <Title order={4}>
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
            </Title>
            <div className={styles["example"]}>
              <ExampleReviewPreview />
            </div>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
