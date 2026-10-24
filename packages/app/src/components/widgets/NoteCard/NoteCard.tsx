import { AlertIcon, LightBulbIcon } from "@primer/octicons-react";
import { Stack } from "@primer/react";
import type { Note } from "@step-review/review-format";
import { FormattedMessage, useIntl } from "react-intl";
import createNoteReference from "../../../business-logic/notes/createNoteReference.ts";
import useNoteIndex from "../../../business-logic/review-view/useNoteIndex.ts";
import { useLoadedReviewContext } from "../../../business-logic/review/LoadedReviewValue.tsx";
import SeverityBadge from "../../design-system/badges/SeverityBadge.tsx";
import CopyIconButton from "../../design-system/CopyIconButton/CopyIconButton.tsx";
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
  return (
    <div
      id={`note-${note.id}`}
      className={styles["card"]}
      data-kind={note.kind}
      data-highlighted={isHighlighted || undefined}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <Stack gap="condensed">
        <div className={styles["header"]}>
          {note.kind === "issue" ? (
            <>
              <AlertIcon size={14} className={styles["icon"]} />
              <SeverityBadge severity={note.severity} />
            </>
          ) : (
            <>
              <LightBulbIcon size={14} className={styles["icon"]} />
              <span className={styles["kind"]}>
                <FormattedMessage defaultMessage="Note" />
              </span>
            </>
          )}
          <span className={styles["id"]}>{note.id}</span>
          {loadedReview && noteLocation && (
            <CopyIconButton
              value={createNoteReference(loadedReview.fileName, noteLocation)}
              label={intl.formatMessage({
                defaultMessage: "Copy the note for your agent",
              })}
            />
          )}
        </div>
        <ReviewMarkdown>{note.body}</ReviewMarkdown>
      </Stack>
    </div>
  );
}
