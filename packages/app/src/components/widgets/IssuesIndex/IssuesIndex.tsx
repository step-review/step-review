import { Group, Stack, Table, Text, Title } from "@mantine/core";
import { FormattedMessage } from "react-intl";
import formatNoteLocation from "../../../business-logic/notes/formatNoteLocation.ts";
import { useCurrentRoundView } from "../../../business-logic/rounds/RoundViewProvider.tsx";
import SeverityBadge from "../../design-system/badges/SeverityBadge.tsx";
import NoteLink from "../NoteLink/NoteLink.tsx";
import StepTitle from "../StepTitle/StepTitle.tsx";

/** Every issue of the round, grouped by step. */
export default function IssuesIndex() {
  const roundView = useCurrentRoundView();
  const groups = roundView.steps
    .map((step) => ({
      step,
      issues: [
        ...step.notes.map((note) => ({ note: note, location: null })),
        ...step.files.flatMap((file) =>
          file.notes.map((note) => ({
            note: note,
            location: formatNoteLocation(note, file.path),
          })),
        ),
      ].filter(({ note }) => note.kind === "issue"),
    }))
    .filter((group) => group.issues.length > 0);
  if (groups.length === 0) {
    return null;
  }
  return (
    <Stack gap="sm">
      <Title order={3}>
        <FormattedMessage defaultMessage="Issues" />
      </Title>
      {groups.map(({ step, issues }) => (
        <div key={step.id}>
          <Text size="sm" fw={600} mb={4}>
            {step.number}. <StepTitle step={step} />
          </Text>
          <Table verticalSpacing={4}>
            <Table.Tbody>
              {issues.map(({ note, location }) => (
                <Table.Tr key={note.id}>
                  <Table.Td w="1%">
                    {note.kind === "issue" && (
                      <SeverityBadge severity={note.severity} />
                    )}
                  </Table.Td>
                  <Table.Td w="1%">
                    <NoteLink noteId={note.id} />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      <Text size="sm" lineClamp={1}>
                        {note.body.split("\n")[0]}
                      </Text>
                    </Group>
                    {location && (
                      <Text size="xs" c="dimmed" ff="monospace" truncate>
                        {location}
                      </Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      ))}
    </Stack>
  );
}
