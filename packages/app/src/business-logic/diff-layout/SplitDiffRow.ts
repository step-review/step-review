import type { DiffLine, Hunk } from "@step-review/review-format";

type SplitDiffRow =
  | { kind: "hunk"; id: string; hunk: Hunk }
  | { kind: "gap"; id: string; hiddenLines: DiffLine[] }
  | {
      kind: "lines";
      id: string;
      oldLine: DiffLine | null;
      newLine: DiffLine | null;
    };

export default SplitDiffRow;
