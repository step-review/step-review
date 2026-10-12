import unquoteGitPath from "./unquoteGitPath.ts";

/**
 * Reads the path from a `--- a/path` or `+++ b/path` line, without the marker.
 * Returns `null` for `/dev/null`.
 */
export default function parseFileHeaderPath(value: string): string | null {
  // Git ends the path with a tab when it contains spaces.
  const path = unquoteGitPath(value.replace(/\t$/u, ""));
  if (path === "/dev/null") {
    return null;
  }
  return path.replace(/^[ab]\//u, "");
}
