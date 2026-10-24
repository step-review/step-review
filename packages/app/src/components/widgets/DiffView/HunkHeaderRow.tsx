import type { Hunk } from "@step-review/review-format";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";

interface Props {
  hunk: Hunk;
  /** Columns before the code: the line numbers. */
  numberColSpan: number;
  codeColSpan: number;
}

export default function HunkHeaderRow({
  hunk,
  numberColSpan,
  codeColSpan,
}: Props) {
  return (
    <DiffTableRow>
      <DiffTableCell kind="number" tone="hunk" colSpan={numberColSpan} />
      <DiffTableCell kind="code" tone="hunk" colSpan={codeColSpan}>
        {`@@ -${hunk.oldStart},${hunk.oldLineCount} +${hunk.newStart},${hunk.newLineCount} @@ ${hunk.heading}`}
      </DiffTableCell>
    </DiffTableRow>
  );
}
