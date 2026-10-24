import { Fragment } from "react";
import type DiffRow from "../../../business-logic/diff-layout/DiffRow.ts";
import lineKeys from "../../../business-logic/diff-layout/lineKeys.ts";
import DiffCode from "../../design-system/DiffCode/DiffCode.tsx";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";
import type DiffRowRenderer from "./DiffRowRenderer.ts";
import GapRow from "./GapRow.tsx";
import HunkHeaderRow from "./HunkHeaderRow.tsx";

interface Props {
  rows: DiffRow[];
  renderer: DiffRowRenderer;
}

export default function UnifiedDiffRows({ rows, renderer }: Props) {
  return rows.map((row) => {
    if (row.kind === "hunk") {
      return (
        <HunkHeaderRow
          key={row.id}
          hunk={row.hunk}
          numberColSpan={2}
          codeColSpan={1}
        />
      );
    }
    if (row.kind === "gap") {
      return (
        <GapRow
          key={row.id}
          hiddenLineCount={row.hiddenLines.length}
          numberColSpan={2}
          codeColSpan={1}
          onExpand={() => renderer.onExpandGap(row.id)}
        />
      );
    }
    const { line } = row;
    const keys = lineKeys(line);
    return (
      <Fragment key={row.id}>
        <DiffTableRow
          lineKeys={keys}
          isHighlighted={renderer.isHighlighted(keys)}
          onHoverChange={(isHovered) =>
            renderer.onRowHoverChange(keys, isHovered)
          }
        >
          <DiffTableCell kind="number" tone={line.type}>
            {line.oldLineNumber}
          </DiffTableCell>
          <DiffTableCell kind="number" tone={line.type}>
            {line.newLineNumber}
          </DiffTableCell>
          <DiffTableCell kind="code" tone={line.type}>
            <DiffCode segments={renderer.getSegments(line)} tone={line.type} />
          </DiffTableCell>
        </DiffTableRow>
        {renderer.renderExtras(keys, 3)}
      </Fragment>
    );
  });
}
