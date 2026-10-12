import { Group, Paper, Stack, Text } from "@mantine/core";
import type { Note } from "@step-review/review-format";
import { IconBulb, IconAlertTriangle } from "@tabler/icons-react";
import { FormattedMessage, useIntl } from "react-intl";
import createNoteReference from "../../../business-logic/notes/createNoteReference.ts";
import { useLoadedReviewContext } from "../../../business-logic/review/LoadedReviewProvider.tsx";
import useNoteIndex from "../../../business-logic/rounds/useNoteIndex.ts";
import SeverityBadge from "../../design-system/badges/SeverityBadge.tsx";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
import IssueVerdictControls from "../IssueVerdictControls/IssueVerdictControls.tsx";
import ReviewMarkdown from "../ReviewMarkdown/ReviewMarkdown.tsx";
import styles from "./NoteCard.module.css";

interface Props {
  note: Note;
  isHighlighted?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

/** A note written by the agent: an explainer or an issue. */
export default function NoteCard({
  note,
  isHighlighted = false,
  onHoverChange,
}: Props) {
  const intl = useIntl();
  const { loadedReview } = useLoadedReviewContext();
  const noteLocation = useNoteIndex().get(note.id);
  const isIssue = note.kind === "issue";
  return (
    <Paper
      id={`note-${note.id}`}
      withBorder
      p="xs"
      className={styles["card"]}
      data-kind={note.kind}
      data-highlighted={isHighlighted || undefined}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <Stack gap={6}>
        <Group gap={6} wrap="nowrap">
          {isIssue ? (
            <IconAlertTriangle size={14} className={styles["issueIcon"]} />
          ) : (
            <IconBulb size={14} className={styles["explainerIcon"]} />
          )}
          {note.kind === "issue" ? (
            <SeverityBadge severity={note.severity} />
          ) : (
            <Text size="xs" fw={600} c="dimmed">
              <FormattedMessage defaultMessage="Note" />
            </Text>
          )}
          <Text size="xs" c="dimmed" ff="monospace" ml="auto">
            {note.id}
          </Text>
          {loadedReview && noteLocation && (
            <CopyIconButton
              value={createNoteReference(loadedReview.fileName, noteLocation)}
              label={intl.formatMessage({
                defaultMessage: "Copy the note for your agent",
              })}
            />
          )}
        </Group>
        <ReviewMarkdown>{note.body}</ReviewMarkdown>
        {isIssue && <IssueVerdictControls noteId={note.id} />}
      </Stack>
    </Paper>
  );
}
