import type { FileNote } from "@step-review/review-format";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import layoutNotes from "../../../business-logic/diff-layout/layoutNotes.ts";
import noteLineKeys from "../../../business-logic/notes/noteLineKeys.ts";
import NoteCard from "../NoteCard/NoteCard.tsx";
import styles from "./NotesColumn.module.css";

interface Props {
  notes: FileNote[];
  /** Element containing the diff rows the notes are anchored to. */
  rowsContainerRef: RefObject<HTMLElement | null>;
  /** Changes whenever the rows change, to lay the notes out again. */
  rowsVersion: unknown;
  highlightedNoteIds: Set<string>;
  onNoteHoverChange: (noteId: string, isHovered: boolean) => void;
}

interface NotesLayout {
  tops: Map<string, number>;
  bottom: number;
}

/** Notes beside the diff, each aligned with its line when there is room. */
export default function NotesColumn({
  notes,
  rowsContainerRef,
  rowsVersion,
  highlightedNoteIds,
  onNoteHoverChange,
}: Props) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [notesLayout, setNotesLayout] = useState<NotesLayout | null>(null);
  useLayoutEffect(() => {
    const column = columnRef.current;
    const rowsContainer = rowsContainerRef.current;
    if (!column || !rowsContainer) {
      return;
    }
    const updateLayout = () => {
      const columnTop = column.getBoundingClientRect().top;
      const noteBoxes = notes.flatMap((note) => {
        const firstKey = noteLineKeys(note)[0];
        const row = rowsContainer.querySelector(
          `tr[data-line-keys~="${firstKey}"]`,
        );
        const noteElement = column.querySelector<HTMLElement>(
          `[data-note-id="${CSS.escape(note.id)}"]`,
        );
        if (!row || !noteElement) {
          return [];
        }
        return [
          {
            id: note.id,
            anchorTop: row.getBoundingClientRect().top - columnTop,
            height: noteElement.offsetHeight,
          },
        ];
      });
      const nextLayout = layoutNotes(noteBoxes, 8);
      setNotesLayout((previousLayout) =>
        previousLayout && isSameLayout(previousLayout, nextLayout)
          ? previousLayout
          : nextLayout,
      );
    };
    updateLayout();
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(rowsContainer);
    for (const child of column.children) {
      resizeObserver.observe(child);
    }
    return () => resizeObserver.disconnect();
  }, [notes, rowsContainerRef, rowsVersion]);
  return (
    <div
      ref={columnRef}
      className={styles["column"]}
      style={{ minHeight: notesLayout?.bottom ?? 0 }}
    >
      {notes.map((note) => {
        const top = notesLayout?.tops.get(note.id);
        return (
          <div
            key={note.id}
            data-note-id={note.id}
            className={styles["note"]}
            style={{
              top: top ?? 0,
              visibility: top === undefined ? "hidden" : undefined,
            }}
          >
            <NoteCard
              note={note}
              isHighlighted={highlightedNoteIds.has(note.id)}
              onHoverChange={(isHovered) =>
                onNoteHoverChange(note.id, isHovered)
              }
            />
          </div>
        );
      })}
    </div>
  );
}

function isSameLayout(first: NotesLayout, second: NotesLayout): boolean {
  return (
    first.bottom === second.bottom &&
    first.tops.size === second.tops.size &&
    [...first.tops].every(([id, top]) => second.tops.get(id) === top)
  );
}
