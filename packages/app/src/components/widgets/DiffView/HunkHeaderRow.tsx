import type { Hunk } from "@step-review/review-format";
import DiffTableCell from "../../design-system/DiffTable/DiffTableCell.tsx";
import DiffTableRow from "../../design-system/DiffTable/DiffTableRow.tsx";

interface Props {
  hunk: Hunk;
  colSpan: number;
}

export default function HunkHeaderRow({ hunk, colSpan }: Props) {
  return (
    <DiffTableRow>
      <DiffTableCell kind="code" tone="hunk" colSpan={colSpan}>
        {`@@ -${hunk.oldStart},${hunk.oldLineCount} +${hunk.newStart},${hunk.newLineCount} @@ ${hunk.heading}`}
      </DiffTableCell>
    </DiffTableRow>
  );
}
