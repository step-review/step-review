import { Alert, Container, Group, Stack, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { FormattedMessage } from "react-intl";
import Logo from "../../design-system/Logo/Logo.tsx";
import PromptGenerator from "../../widgets/PromptGenerator/PromptGenerator.tsx";
import ReviewDropzone from "../../widgets/ReviewDropzone/ReviewDropzone.tsx";
import styles from "./Start.module.css";

interface Props {
  /** Set when a review page was opened without a loaded review. */
  isReviewMissing?: boolean;
}

export default function Start({ isReviewMissing = false }: Props) {
  return (
    <Container size="md" className={styles["container"]}>
      <Stack gap={40}>
        <Group justify="center" gap="md" wrap="nowrap" mb={40}>
          <Logo size={56} />
          <div>
            <Title order={2}>Step Review</Title>
            <Text size="lg" c="dimmed">
              <FormattedMessage defaultMessage="A better way to review PRs" />
            </Text>
          </div>
        </Group>
        {isReviewMissing && (
          <Alert icon={<IconInfoCircle />} color="blue">
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
      </Stack>
    </Container>
  );
}
