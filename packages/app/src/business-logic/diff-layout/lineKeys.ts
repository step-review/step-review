import type { DiffLine } from "@step-review/review-format";

/**
 * Keys identifying a diff line by side and line number, e.g. `new:12`. A
 * context line has a key for each side.
 */
export default function lineKeys(line: DiffLine): string[] {
  const keys: string[] = [];
  if (line.oldLineNumber !== null) {
    keys.push(`old:${line.oldLineNumber}`);
  }
  if (line.newLineNumber !== null) {
    keys.push(`new:${line.newLineNumber}`);
  }
  return keys;
}
