import { Anchor, Code, Group, Stack, Text, Title } from "@mantine/core";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useCurrentReviewView } from "../../../business-logic/review-view/ReviewViewProvider.tsx";

export default function OverviewHeader() {
  const { data, diff } = useCurrentReviewView();
  const { target, createdAt } = data;
  const additions = diff.reduce((sum, fileDiff) => sum + fileDiff.additions, 0);
  const deletions = diff.reduce((sum, fileDiff) => sum + fileDiff.deletions, 0);
  const noteCount = data.steps.reduce(
    (sum, step) =>
      sum +
      (step.notes?.length ?? 0) +
      step.files.reduce(
        (fileSum, stepFile) => fileSum + (stepFile.notes?.length ?? 0),
        0,
      ),
    0,
  );
  return (
    <Stack gap={6}>
      <Text size="sm" c="dimmed" fw={600} tt="uppercase">
        <FormattedMessage
          defaultMessage="Overview · {date}"
          values={{
            date: (
              <FormattedDate
                value={createdAt}
                dateStyle="medium"
                timeStyle="short"
              />
            ),
          }}
        />
      </Text>
      <Title order={1}>{target.title}</Title>
      <Group gap="md" c="dimmed">
        {target.url && (
          <Anchor href={target.url} target="_blank" rel="noreferrer" size="sm">
            {target.url}
          </Anchor>
        )}
        <Text size="sm">
          {target.baseRef && <Code>{target.baseRef}</Code>}{" "}
          <Code>{target.baseCommit.slice(0, 7)}</Code> →{" "}
          {target.headRef && <Code>{target.headRef}</Code>}{" "}
          <Code>{target.headCommit.slice(0, 7)}</Code>
        </Text>
      </Group>
      <Group gap="md">
        <Text size="sm">
          <FormattedMessage
            defaultMessage="{fileCount, plural, one {# file} other {# files}}"
            values={{ fileCount: diff.length }}
          />
        </Text>
        <Text size="sm" c="addition" fw={600}>
          +{additions}
        </Text>
        <Text size="sm" c="removal" fw={600}>
          −{deletions}
        </Text>
        <Text size="sm">
          <FormattedMessage
            defaultMessage="{noteCount, plural, one {# note} other {# notes}}"
            values={{ noteCount }}
          />
        </Text>
      </Group>
    </Stack>
  );
}
