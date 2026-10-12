import type { DiffLine, Hunk } from "@step-review/review-format";

type DiffRow =
  | { kind: "hunk"; id: string; hunk: Hunk }
  | { kind: "line"; id: string; line: DiffLine }
  | { kind: "gap"; id: string; hiddenLines: DiffLine[] };

export default DiffRow;
