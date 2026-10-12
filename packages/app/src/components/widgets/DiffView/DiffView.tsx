import { useElementSize } from "@mantine/hooks";
import type { DiffLine, FileNote, Hunk } from "@step-review/review-format";
import { useMemo, useRef, useState } from "react";
import buildDiffRows from "../../../business-logic/diff-layout/buildDiffRows.ts";
import buildSplitRows from "../../../business-logic/diff-layout/buildSplitRows.ts";
import computeWordDiffs from "../../../business-logic/diff-layout/computeWordDiffs.ts";
import splitLineSegments from "../../../business-logic/diff-layout/splitLineSegments.ts";
import useHighlightedLines from "../../../business-logic/highlighting/useHighlightedLines.ts";
import noteLineKeys from "../../../business-logic/notes/noteLineKeys.ts";
import type CommentTarget from "../../../business-logic/review-state/CommentTarget.ts";
import createCommentId from "../../../business-logic/review-state/createCommentId.ts";
import { useReviewState } from "../../../business-logic/review-state/ReviewStateProvider.tsx";
import DiffTable from "../../design-system/DiffTable/DiffTable.tsx";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";
import CommentCard from "../CommentCard/CommentCard.tsx";
import CommentEditor from "../CommentEditor/CommentEditor.tsx";
import NoteCard from "../NoteCard/NoteCard.tsx";
import NotesColumn from "../NotesColumn/NotesColumn.tsx";
import type DiffRowRenderer from "./DiffRowRenderer.ts";
import styles from "./DiffView.module.css";
import SplitDiffRows from "./SplitDiffRows.tsx";
import UnifiedDiffRows from "./UnifiedDiffRows.tsx";

interface Props {
  path: string;
  stepId: string;
  roundNumber: number;
  hunks: Hunk[];
  /** Notes anchored to lines of the hunks. */
  notes: FileNote[];
  layout: "unified" | "split";
}

type LineCommentTarget = Extract<CommentTarget, { kind: "line" }>;

function commentKey(target: CommentTarget): string {
  return target.kind === "line" ? `${target.side}:${target.line}` : "";
}

/** Minimum width for the notes column; narrower diffs show notes inline. */
const notesColumnMinimumWidth = 960;

export default function DiffView({
  path,
  stepId,
  roundNumber,
  hunks,
  notes,
  layout,
}: Props) {
  const { reviewState, dispatch } = useReviewState();
  const [expandedGapIds, setExpandedGapIds] = useState(() => new Set<string>());
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [hoveredLineKeys, setHoveredLineKeys] = useState<string[]>([]);
  const [draftTarget, setDraftTarget] = useState<LineCommentTarget | null>(
    null,
  );
  const { ref: wrapperRef, width } = useElementSize();
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const isWide = width >= notesColumnMinimumWidth;
  const lineComments = useMemo(
    () =>
      reviewState.comments.filter(
        (comment) =>
          comment.roundNumber === roundNumber &&
          comment.target.kind === "line" &&
          comment.target.stepId === stepId &&
          comment.target.path === path,
      ),
    [reviewState.comments, roundNumber, stepId, path],
  );
  const pinnedLineKeys = useMemo(
    () =>
      new Set([
        ...notes.flatMap(noteLineKeys),
        ...lineComments.map((comment) => commentKey(comment.target)),
        ...(draftTarget ? [commentKey(draftTarget)] : []),
      ]),
    [notes, lineComments, draftTarget],
  );
  const rows = useMemo(
    () =>
      buildDiffRows(hunks, {
        contextLineCount: 3,
        pinnedLineKeys,
        expandedGapIds,
      }),
    [hunks, pinnedLineKeys, expandedGapIds],
  );
  const splitRows = useMemo(
    () => (layout === "split" ? buildSplitRows(rows) : []),
    [layout, rows],
  );
  const rowsVersion = useMemo(
    () => ({}),
    // A new object whenever what the rows show changes.
    [rows, splitRows, lineComments, draftTarget],
  );
  const highlightedLines = useHighlightedLines(hunks, path, true);
  const wordDiffs = useMemo(() => computeWordDiffs(hunks), [hunks]);
  const hoveredNote = notes.find((note) => note.id === hoveredNoteId);
  const highlightedKeys = new Set(hoveredNote ? noteLineKeys(hoveredNote) : []);
  const highlightedNoteIds = new Set(
    notes
      .filter((note) =>
        noteLineKeys(note).some((key) => hoveredLineKeys.includes(key)),
      )
      .map((note) => note.id),
  );
  const renderer: DiffRowRenderer = {
    getSegments: (line: DiffLine) =>
      splitLineSegments(
        line.content,
        highlightedLines.get(line),
        wordDiffs.get(line),
      ),
    isHighlighted: (lineKeys) =>
      lineKeys.some((key) => highlightedKeys.has(key)),
    onRowHoverChange: (lineKeys, isHovered) =>
      setHoveredLineKeys(isHovered ? lineKeys : []),
    onLineNumberClick: (line, side) => {
      const lineNumber =
        side === "old" ? line.oldLineNumber : line.newLineNumber;
      if (lineNumber !== null) {
        setDraftTarget({
          kind: "line",
          stepId,
          path,
          side,
          line: lineNumber,
          lineText: line.content,
        });
      }
    },
    onExpandGap: (gapId) =>
      setExpandedGapIds((ids) => new Set([...ids, gapId])),
    renderExtras: (lineKeys, colSpan) => {
      const rowNotes = isWide
        ? []
        : notes.filter((note) =>
            lineKeys.includes(noteLineKeys(note)[0] ?? ""),
          );
      const rowComments = lineComments.filter((comment) =>
        lineKeys.includes(commentKey(comment.target)),
      );
      const hasDraft =
        draftTarget !== null && lineKeys.includes(commentKey(draftTarget));
      if (rowNotes.length === 0 && rowComments.length === 0 && !hasDraft) {
        return null;
      }
      return (
        <DiffTableRow>
          <DiffTableCell kind="full" colSpan={colSpan}>
            <div className={styles["extras"]}>
              {rowNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
              {rowComments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
              {hasDraft && (
                <CommentEditor
                  onCancel={() => setDraftTarget(null)}
                  onSave={(body) => {
                    dispatch({
                      type: "addComment",
                      comment: {
                        id: createCommentId(),
                        roundNumber,
                        target: draftTarget,
                        body,
                        createdAt: new Date().toISOString(),
                      },
                    });
                    setDraftTarget(null);
                  }}
                />
              )}
            </div>
          </DiffTableCell>
        </DiffTableRow>
      );
    },
  };
  return (
    <div ref={wrapperRef} className={styles["wrapper"]}>
      <div ref={rowsContainerRef} className={styles["rows"]}>
        <DiffTable layout={layout}>
          {layout === "split" ? (
            <SplitDiffRows rows={splitRows} renderer={renderer} />
          ) : (
            <UnifiedDiffRows rows={rows} renderer={renderer} />
          )}
        </DiffTable>
      </div>
      {isWide && notes.length > 0 && (
        <NotesColumn
          notes={notes}
          rowsContainerRef={rowsContainerRef}
          rowsVersion={rowsVersion}
          highlightedNoteIds={highlightedNoteIds}
          onNoteHoverChange={(noteId, isHovered) =>
            setHoveredNoteId(isHovered ? noteId : null)
          }
        />
      )}
    </div>
  );
}
