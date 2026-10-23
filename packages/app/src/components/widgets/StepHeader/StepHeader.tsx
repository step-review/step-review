import { Group, Stack, Text, Title } from "@mantine/core";
import { FormattedMessage } from "react-intl";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import AttentionBadge from "../../design-system/badges/AttentionBadge.tsx";
import NoteCard from "../NoteCard/NoteCard.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";

interface Props {
  stepView: StepView;
  stepCount: number;
  areExplainersHidden: boolean;
}

export default function StepHeader({
  stepView,
  stepCount,
  areExplainersHidden,
}: Props) {
  return (
    <Stack gap="sm" maw={900}>
      <Group gap="xs">
        <Text size="sm" c="dimmed" fw={600} tt="uppercase">
          <FormattedMessage
            defaultMessage="Step {stepNumber} of {stepCount}"
            values={{ stepNumber: stepView.number, stepCount }}
          />
        </Text>
        <AttentionBadge attention={stepView.attention} />
      </Group>
      <Title order={2}>
        <StepTitle step={stepView} />
      </Title>
      {stepView.intro ? (
        <ReviewMarkdown>{stepView.intro}</ReviewMarkdown>
      ) : (
        <Text size="sm" c="dimmed">
          <FormattedMessage defaultMessage="These files changed in the PR, but the review doesn't assign them to a step." />
        </Text>
      )}
      {stepView.notes
        .filter((note) => !areExplainersHidden || note.kind === "issue")
        .map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
    </Stack>
  );
}
