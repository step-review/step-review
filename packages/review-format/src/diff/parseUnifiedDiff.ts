import DiffParseError from "./DiffParseError.ts";
import type FileDiff from "./FileDiff.ts";
import type Hunk from "./Hunk.ts";
import parseDiffGitPaths from "./parseDiffGitPaths.ts";
import parseFileHeaderPath from "./parseFileHeaderPath.ts";
import parseHunkHeader from "./parseHunkHeader.ts";
import unquoteGitPath from "./unquoteGitPath.ts";

interface FileState {
  fileDiff: FileDiff;
  headerOldPath: string | null;
  headerNewPath: string | null;
  renameFrom: string | null;
  renameTo: string | null;
}

/**
 * Parses the output of `git diff` (unified format, with `diff --git` file
 * headers) into one entry per file.
 *
 * @throws {DiffParseError} When a hunk is malformed.
 */
export default function parseUnifiedDiff(diffText: string): FileDiff[] {
  const fileDiffs: FileDiff[] = [];
  let fileState: FileState | null = null;
  let hunk: Hunk | null = null;
  let oldLinesLeft = 0;
  let newLinesLeft = 0;
  const lines = diffText.split("\n");
  // A trailing newline does not start another line.
  if (lines.at(-1) === "") {
    lines.pop();
  }
  for (const [index, rawLine] of lines.entries()) {
    const line = rawLine.replace(/\r$/u, "");
    const lineNumber = index + 1;
    if (hunk && (oldLinesLeft > 0 || newLinesLeft > 0)) {
      const prefix = line[0] ?? " ";
      const content = line.slice(1);
      const oldLineNumber = hunk.oldStart + hunk.oldLineCount - oldLinesLeft;
      const newLineNumber = hunk.newStart + hunk.newLineCount - newLinesLeft;
      if (prefix === " " && oldLinesLeft > 0 && newLinesLeft > 0) {
        hunk.lines.push({
          type: "context",
          content,
          oldLineNumber,
          newLineNumber,
          noNewlineAtEnd: false,
        });
        oldLinesLeft--;
        newLinesLeft--;
      } else if (prefix === "+" && newLinesLeft > 0) {
        hunk.lines.push({
          type: "addition",
          content,
          oldLineNumber: null,
          newLineNumber,
          noNewlineAtEnd: false,
        });
        newLinesLeft--;
        fileState!.fileDiff.additions++;
      } else if (prefix === "-" && oldLinesLeft > 0) {
        hunk.lines.push({
          type: "deletion",
          content,
          oldLineNumber,
          newLineNumber: null,
          noNewlineAtEnd: false,
        });
        oldLinesLeft--;
        fileState!.fileDiff.deletions++;
      } else if (prefix === "\\") {
        markNoNewlineAtEnd(hunk);
      } else {
        throw new DiffParseError(
          "The hunk has fewer lines than its header says.",
          lineNumber,
        );
      }
      continue;
    }
    if (line.startsWith("diff --git ")) {
      if (fileState) {
        fileDiffs.push(finishFile(fileState));
      }
      const paths = parseDiffGitPaths(line.slice("diff --git ".length));
      fileState = {
        fileDiff: {
          path: paths.newPath,
          oldPath: paths.oldPath === paths.newPath ? null : paths.oldPath,
          status: "modified",
          binary: false,
          hunks: [],
          additions: 0,
          deletions: 0,
        },
        headerOldPath: null,
        headerNewPath: null,
        renameFrom: null,
        renameTo: null,
      };
      hunk = null;
      continue;
    }
    if (!fileState) {
      // Text before the first file, e.g. a commit message from `git show`.
      continue;
    }
    if (line.startsWith("\\") && hunk) {
      markNoNewlineAtEnd(hunk);
    } else if (line.startsWith("@@")) {
      hunk = parseHunkHeader(line);
      if (!hunk) {
        throw new DiffParseError("Invalid hunk header.", lineNumber);
      }
      oldLinesLeft = hunk.oldLineCount;
      newLinesLeft = hunk.newLineCount;
      fileState.fileDiff.hunks.push(hunk);
    } else if (hunk) {
      throw new DiffParseError(
        "The hunk has more lines than its header says.",
        lineNumber,
      );
    } else {
      readHeaderLine(fileState, line);
    }
  }
  if (hunk && (oldLinesLeft > 0 || newLinesLeft > 0)) {
    throw new DiffParseError(
      "The diff ends in the middle of a hunk.",
      lines.length,
    );
  }
  if (fileState) {
    fileDiffs.push(finishFile(fileState));
  }
  return fileDiffs;
}

function readHeaderLine(fileState: FileState, line: string): void {
  const fileDiff = fileState.fileDiff;
  if (line.startsWith("new file mode")) {
    fileDiff.status = "added";
  } else if (line.startsWith("deleted file mode")) {
    fileDiff.status = "deleted";
  } else if (line.startsWith("rename from ")) {
    fileDiff.status = "renamed";
    fileState.renameFrom = unquoteGitPath(line.slice("rename from ".length));
  } else if (line.startsWith("rename to ")) {
    fileState.renameTo = unquoteGitPath(line.slice("rename to ".length));
  } else if (line.startsWith("copy from ")) {
    fileDiff.status = "copied";
    fileState.renameFrom = unquoteGitPath(line.slice("copy from ".length));
  } else if (line.startsWith("copy to ")) {
    fileState.renameTo = unquoteGitPath(line.slice("copy to ".length));
  } else if (line.startsWith("Binary files ") || line === "GIT binary patch") {
    fileDiff.binary = true;
  } else if (line.startsWith("--- ")) {
    fileState.headerOldPath = parseFileHeaderPath(line.slice(4));
  } else if (line.startsWith("+++ ")) {
    fileState.headerNewPath = parseFileHeaderPath(line.slice(4));
  }
}

function finishFile(fileState: FileState): FileDiff {
  const fileDiff = fileState.fileDiff;
  const oldPath =
    fileState.renameFrom ?? fileState.headerOldPath ?? fileDiff.oldPath;
  const newPath = fileState.renameTo ?? fileState.headerNewPath;
  if (fileDiff.status === "deleted") {
    fileDiff.path = oldPath ?? fileDiff.path;
    fileDiff.oldPath = null;
  } else {
    fileDiff.path = newPath ?? fileDiff.path;
    fileDiff.oldPath =
      fileDiff.status === "renamed" || fileDiff.status === "copied"
        ? oldPath
        : null;
  }
  return fileDiff;
}

function markNoNewlineAtEnd(hunk: Hunk): void {
  const lastLine = hunk.lines.at(-1);
  if (lastLine) {
    lastLine.noNewlineAtEnd = true;
  }
}
