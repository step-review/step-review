import type FileDiff from "../diff/FileDiff.ts";

export default function findFileDiff(
  fileDiffs: FileDiff[],
  path: string,
): FileDiff | null {
  return fileDiffs.find((fileDiff) => fileDiff.path === path) ?? null;
}
