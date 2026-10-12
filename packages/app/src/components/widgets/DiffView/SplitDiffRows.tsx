import type { DiffLine } from "@step-review/review-format";
import { Fragment } from "react";
import lineKeys from "../../../business-logic/diff-layout/lineKeys.ts";
import type SplitDiffRow from "../../../business-logic/diff-layout/SplitDiffRow.ts";
import DiffCode from "../../design-system/DiffCode/DiffCode.tsx";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";
import type DiffRowRenderer from "./DiffRowRenderer.ts";
import GapRow from "./GapRow.tsx";
import HunkHeaderRow from "./HunkHeaderRow.tsx";

interface Props {
  rows: SplitDiffRow[];
  renderer: DiffRowRenderer;
}

export default function SplitDiffRows({ rows, renderer }: Props) {
  const renderSide = (line: DiffLine | null, side: "old" | "new") => {
    if (!line) {
      return [
        <DiffTableCell key="number" kind="number" tone="empty" />,
        <DiffTableCell key="code" kind="code" tone="empty" />,
      ];
    }
    return [
      <DiffTableCell
        key="number"
        kind="number"
        tone={line.type}
        onClick={() => renderer.onLineNumberClick(line, side)}
      >
        {side === "old" ? line.oldLineNumber : line.newLineNumber}
      </DiffTableCell>,
      <DiffTableCell key="code" kind="code" tone={line.type}>
        <DiffCode segments={renderer.getSegments(line)} tone={line.type} />
      </DiffTableCell>,
    ];
  };
  return rows.map((row) => {
    if (row.kind === "hunk") {
      return <HunkHeaderRow key={row.id} hunk={row.hunk} colSpan={4} />;
    }
    if (row.kind === "gap") {
      return (
        <GapRow
          key={row.id}
          hiddenLineCount={row.hiddenLines.length}
          colSpan={4}
          onExpand={() => renderer.onExpandGap(row.id)}
        />
      );
    }
    const keys = [
      ...new Set([
        ...(row.oldLine ? lineKeys(row.oldLine) : []),
        ...(row.newLine ? lineKeys(row.newLine) : []),
      ]),
    ];
    return (
      <Fragment key={row.id}>
        <DiffTableRow
          lineKeys={keys}
          isHighlighted={renderer.isHighlighted(keys)}
          onHoverChange={(isHovered) =>
            renderer.onRowHoverChange(keys, isHovered)
          }
        >
          {renderSide(row.oldLine, "old")}
          {renderSide(row.newLine, "new")}
        </DiffTableRow>
        {renderer.renderExtras(keys, 4)}
      </Fragment>
    );
  });
}
