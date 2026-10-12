import {
  Badge,
  Code,
  Group,
  List,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import type { IssueStatus } from "@step-review/review-format";
import { FormattedMessage } from "react-intl";
import { useCurrentRoundView } from "../../../business-logic/rounds/RoundViewProvider.tsx";
import NoteLink from "../NoteLink/NoteLink.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";

const statusColors: Record<IssueStatus, string> = {
  resolved: "teal",
  open: "orange",
  obsolete: "gray",
};

/** What changed since the previous round, and what happened to its issues. */
export default function PreviousRoundSummary() {
  const roundView = useCurrentRoundView();
  const { previousRound, round, droppedPaths } = roundView;
  const summary = round.data.previousRound;
  if (!previousRound || !summary) {
    return null;
  }
  return (
    <Paper withBorder p="md">
      <Stack gap="sm">
        <Title order={3}>
          <FormattedMessage
            defaultMessage="Since round {roundNumber} ({commit})"
            values={{
              roundNumber: previousRound.number,
              commit: (
                <Code>{previousRound.data.target.headCommit.slice(0, 7)}</Code>
              ),
            }}
          />
        </Title>
        {summary.changes.length > 0 && (
          <List size="sm" spacing={4}>
            {summary.changes.map((change, index) => (
              <List.Item key={index}>
                <ReviewMarkdown>{change}</ReviewMarkdown>
              </List.Item>
            ))}
          </List>
        )}
        {summary.issues.length > 0 && (
          <Table verticalSpacing={4}>
            <Table.Tbody>
              {summary.issues.map((issue) => (
                <Table.Tr key={issue.noteId}>
                  <Table.Td w="1%" style={{ whiteSpace: "nowrap" }}>
                    <Badge
                      miw="max-content"
                      color={statusColors[issue.status]}
                      variant="light"
                      radius="sm"
                    >
                      {issue.status === "resolved" ? (
                        <FormattedMessage defaultMessage="Resolved" />
                      ) : issue.status === "open" ? (
                        <FormattedMessage defaultMessage="Still open" />
                      ) : (
                        <FormattedMessage defaultMessage="Obsolete" />
                      )}
                    </Badge>
                  </Table.Td>
                  <Table.Td w="1%">
                    <NoteLink noteId={issue.noteId} />
                  </Table.Td>
                  <Table.Td>
                    {issue.comment ? (
                      <ReviewMarkdown>{issue.comment}</ReviewMarkdown>
                    ) : null}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
        {droppedPaths.length > 0 && (
          <div>
            <Text size="sm" fw={600}>
              <FormattedMessage defaultMessage="No longer in the PR" />
            </Text>
            <Group gap={6} mt={4}>
              {droppedPaths.map((path) => (
                <Code key={path}>{path}</Code>
              ))}
            </Group>
          </div>
        )}
      </Stack>
    </Paper>
  );
}
