import unquoteGitPath from "./unquoteGitPath.ts";

/**
 * Reads the old and new paths from the arguments of a `diff --git` line. Used
 * only when the file header has no `---`/`+++` or rename lines, e.g. for binary
 * files and mode changes.
 */
export default function parseDiffGitPaths(pathsText: string): {
  oldPath: string;
  newPath: string;
} {
  const quoted = /^("(?:[^"\\]|\\.)*"|\S+) ("(?:[^"\\]|\\.)*"|\S+)$/u.exec(
    pathsText,
  );
  if (quoted && (pathsText.startsWith('"') || pathsText.endsWith('"'))) {
    return {
      oldPath: stripPrefix(unquoteGitPath(quoted[1]!), "a/"),
      newPath: stripPrefix(unquoteGitPath(quoted[2]!), "b/"),
    };
  }
  // Unquoted paths can contain spaces. When both paths are the same, the
  // split point is in the middle.
  const middle = (pathsText.length - 1) / 2;
  if (
    Number.isInteger(middle) &&
    pathsText[middle] === " " &&
    pathsText.slice(2, middle) === pathsText.slice(middle + 3)
  ) {
    const path = pathsText.slice(2, middle);
    return { oldPath: path, newPath: path };
  }
  const separator = pathsText.lastIndexOf(" b/");
  return {
    oldPath: stripPrefix(pathsText.slice(0, separator), "a/"),
    newPath: pathsText.slice(separator + 3),
  };
}

function stripPrefix(path: string, prefix: string): string {
  return path.startsWith(prefix) ? path.slice(prefix.length) : path;
}
