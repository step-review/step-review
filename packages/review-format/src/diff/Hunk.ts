import type DiffLine from "./DiffLine.ts";

export default interface Hunk {
  oldStart: number;
  oldLineCount: number;
  newStart: number;
  newLineCount: number;
  /** Text after the second `@@`, usually the enclosing function. */
  heading: string;
  lines: DiffLine[];
}
