import { useResizeObserver } from "@primer/react";
import type { DiffLine, FileNote, Hunk } from "@step-review/review-format";
import { useMemo, useRef, useState } from "react";
import buildDiffRows from "../../../business-logic/diff-layout/buildDiffRows.ts";
import buildSplitRows from "../../../business-logic/diff-layout/buildSplitRows.ts";
import computeWordDiffs from "../../../business-logic/diff-layout/computeWordDiffs.ts";
import splitLineSegments from "../../../business-logic/diff-layout/splitLineSegments.ts";
import useHighlightedLines from "../../../business-logic/highlighting/useHighlightedLines.ts";
import noteLineKeys from "../../../business-logic/notes/noteLineKeys.ts";
import DiffTable from "../../design-system/DiffTable/DiffTable.tsx";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";
import NoteCard from "../NoteCard/NoteCard.tsx";
import NotesColumn from "../NotesColumn/NotesColumn.tsx";
import type DiffRowRenderer from "./DiffRowRenderer.ts";
import styles from "./DiffView.module.css";
import SplitDiffRows from "./SplitDiffRows.tsx";
import UnifiedDiffRows from "./UnifiedDiffRows.tsx";

interface Props {
  path: string;
  hunks: Hunk[];
  /** Notes anchored to lines of the hunks. */
  notes: FileNote[];
  layout: "unified" | "split";
}

/** Minimum width for the notes column; narrower diffs show notes inline. */
const notesColumnMinimumWidth = 960;

export default function DiffView({ path, hunks, notes, layout }: Props) {
  const [expandedGapIds, setExpandedGapIds] = useState(() => new Set<string>());
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [hoveredLineKeys, setHoveredLineKeys] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useResizeObserver((entries) => {
    setWidth(entries[0]?.contentRect.width ?? 0);
  }, wrapperRef);
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const isWide = width >= notesColumnMinimumWidth;
  const pinnedLineKeys = useMemo(
    () => new Set(notes.flatMap(noteLineKeys)),
    [notes],
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
    [rows, splitRows],
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
    onExpandGap: (gapId) =>
      setExpandedGapIds((ids) => new Set([...ids, gapId])),
    renderExtras: (lineKeys, colSpan) => {
      const rowNotes = isWide
        ? []
        : notes.filter((note) =>
            lineKeys.includes(noteLineKeys(note)[0] ?? ""),
          );
      if (rowNotes.length === 0) {
        return null;
      }
      return (
        <DiffTableRow>
          <DiffTableCell kind="full" colSpan={colSpan}>
            <div className={styles["extras"]}>
              {rowNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
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
