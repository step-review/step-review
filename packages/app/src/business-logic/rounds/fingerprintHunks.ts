import type { FileDiff, Hunk } from "@step-review/review-format";
import hashString from "../review/hashString.ts";

/**
 * Fingerprint of a file's changes. Line numbers are left out, so a diff that
 * only moved within the file (e.g. after a rebase) keeps its fingerprint.
 */
export default function fingerprintHunks(
  fileDiff: FileDiff,
  hunks: Hunk[],
): string {
  return hashString(
    JSON.stringify([
      fileDiff.path,
      fileDiff.oldPath,
      fileDiff.status,
      hunks.map((hunk) =>
        hunk.lines.map((line) => `${line.type[0]}${line.content}`),
      ),
    ]),
  );
}
