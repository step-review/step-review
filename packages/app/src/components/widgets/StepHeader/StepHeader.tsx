import { ActionIcon, Group, Stack, Text, Title, Tooltip } from "@mantine/core";
import { IconMessagePlus } from "@tabler/icons-react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import type StepView from "../../../business-logic/rounds/StepView.ts";
import AttentionBadge from "../../design-system/badges/AttentionBadge.tsx";
import NoteCard from "../NoteCard/NoteCard.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";
import TargetComments from "../TargetComments/TargetComments.tsx";

interface Props {
  stepView: StepView;
  stepCount: number;
  roundNumber: number;
  areExplainersHidden: boolean;
}

export default function StepHeader({
  stepView,
  stepCount,
  roundNumber,
  areExplainersHidden,
}: Props) {
  const intl = useIntl();
  const [isAddingComment, setIsAddingComment] = useState(false);
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
      <Group gap="xs" wrap="nowrap" align="flex-start">
        <Title order={2}>
          <StepTitle step={stepView} />
        </Title>
        <Tooltip
          label={<FormattedMessage defaultMessage="Comment on the step" />}
          withArrow
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            mt={6}
            onClick={() => setIsAddingComment(true)}
            aria-label={intl.formatMessage({
              defaultMessage: "Comment on the step",
            })}
          >
            <IconMessagePlus size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
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
      <TargetComments
        roundNumber={roundNumber}
        target={{ kind: "step", stepId: stepView.id }}
        isAdding={isAddingComment}
        onAddingDone={() => setIsAddingComment(false)}
      />
    </Stack>
  );
}
