import {
  Alert,
  Anchor,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { FormattedMessage } from "react-intl";
import Logo from "../../design-system/Logo/Logo.tsx";
import ColorSchemeToggle from "../../widgets/ColorSchemeToggle/ColorSchemeToggle.tsx";
import PromptGenerator from "../../widgets/PromptGenerator/PromptGenerator.tsx";
import ReviewDropzone from "../../widgets/ReviewDropzone/ReviewDropzone.tsx";
import styles from "./Start.module.css";

interface Props {
  /** Set when a review page was opened without a loaded review. */
  isReviewMissing?: boolean;
}

export default function Start({ isReviewMissing = false }: Props) {
  return (
    <Container size="sm" className={styles["container"]}>
      <Stack gap="xl">
        <div className={styles["header"]}>
          <div>
            <Group gap="sm" wrap="nowrap">
              <Logo size={44} />
              <Title order={1}>step-review</Title>
            </Group>
            <Text c="dimmed">
              <FormattedMessage defaultMessage="Review pull requests step by step, with notes from your coding agent." />
            </Text>
          </div>
          <ColorSchemeToggle />
        </div>
        {isReviewMissing && (
          <Alert icon={<IconInfoCircle />} color="blue">
            <FormattedMessage defaultMessage="Load the review file again to continue where you were." />
          </Alert>
        )}
        <Paper withBorder p="lg">
          <Stack gap="md">
            <Title order={3}>
              <FormattedMessage defaultMessage="1. Ask your agent for a review" />
            </Title>
            <PromptGenerator />
          </Stack>
        </Paper>
        <Paper withBorder p="lg">
          <Stack gap="md">
            <Title order={3}>
              <FormattedMessage defaultMessage="2. Open the review" />
            </Title>
            <ReviewDropzone />
          </Stack>
        </Paper>
        <Text size="sm" c="dimmed">
          <FormattedMessage
            defaultMessage="Agents follow the instructions in {skillLink}. Review files are validated against {schemaLink}."
            values={{
              skillLink: <Anchor href="/SKILL.md">SKILL.md</Anchor>,
              schemaLink: (
                <Anchor href="/schema/v1.json">schema/v1.json</Anchor>
              ),
            }}
          />
        </Text>
      </Stack>
    </Container>
  );
}
