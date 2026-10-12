import { expect, it } from "vitest";
import DiffParseError from "./DiffParseError.ts";
import parseUnifiedDiff from "./parseUnifiedDiff.ts";

it("parses a modified file with line numbers on both sides", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      "diff --git a/src/sum.ts b/src/sum.ts",
      "index 1111111..2222222 100644",
      "--- a/src/sum.ts",
      "+++ b/src/sum.ts",
      "@@ -1,3 +1,3 @@ export",
      " export function sum(a, b) {",
      "-  return a - b;",
      "+  return a + b;",
      " }",
      "",
    ].join("\n"),
  );

  // Verify
  expect(fileDiffs).toEqual([
    {
      path: "src/sum.ts",
      oldPath: null,
      status: "modified",
      binary: false,
      additions: 1,
      deletions: 1,
      hunks: [
        {
          oldStart: 1,
          oldLineCount: 3,
          newStart: 1,
          newLineCount: 3,
          heading: "export",
          lines: [
            {
              type: "context",
              content: "export function sum(a, b) {",
              oldLineNumber: 1,
              newLineNumber: 1,
              noNewlineAtEnd: false,
            },
            {
              type: "deletion",
              content: "  return a - b;",
              oldLineNumber: 2,
              newLineNumber: null,
              noNewlineAtEnd: false,
            },
            {
              type: "addition",
              content: "  return a + b;",
              oldLineNumber: null,
              newLineNumber: 2,
              noNewlineAtEnd: false,
            },
            {
              type: "context",
              content: "}",
              oldLineNumber: 3,
              newLineNumber: 3,
              noNewlineAtEnd: false,
            },
          ],
        },
      ],
    },
  ]);
});

it("parses an added file", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      "diff --git a/README.md b/README.md",
      "new file mode 100644",
      "index 0000000..3333333",
      "--- /dev/null",
      "+++ b/README.md",
      "@@ -0,0 +1 @@",
      "+# Title",
    ].join("\n"),
  );

  // Verify
  expect(
    fileDiffs.map(({ path, oldPath, status }) => ({ path, oldPath, status })),
  ).toEqual([{ path: "README.md", oldPath: null, status: "added" }]);
});

it("uses the old path as the path of a deleted file", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      "diff --git a/old.txt b/old.txt",
      "deleted file mode 100644",
      "index 3333333..0000000",
      "--- a/old.txt",
      "+++ /dev/null",
      "@@ -1 +0,0 @@",
      "-gone",
    ].join("\n"),
  );

  // Verify
  expect(
    fileDiffs.map(({ path, oldPath, status }) => ({ path, oldPath, status })),
  ).toEqual([{ path: "old.txt", oldPath: null, status: "deleted" }]);
});

it("parses a rename without content changes", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      "diff --git a/src/a b.ts b/src/c d.ts",
      "similarity index 100%",
      "rename from src/a b.ts",
      "rename to src/c d.ts",
    ].join("\n"),
  );

  // Verify
  expect(
    fileDiffs.map(({ path, oldPath, status, hunks }) => ({
      path,
      oldPath,
      status,
      hunks,
    })),
  ).toEqual([
    { path: "src/c d.ts", oldPath: "src/a b.ts", status: "renamed", hunks: [] },
  ]);
});

it("marks a binary file", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      "diff --git a/logo.png b/logo.png",
      "index 4444444..5555555 100644",
      "Binary files a/logo.png and b/logo.png differ",
    ].join("\n"),
  );

  // Verify
  expect(fileDiffs.map(({ path, binary }) => ({ path, binary }))).toEqual([
    { path: "logo.png", binary: true },
  ]);
});

it("marks the last line of a file without a trailing newline", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      "diff --git a/a.txt b/a.txt",
      "--- a/a.txt",
      "+++ b/a.txt",
      "@@ -1 +1 @@",
      "-before",
      "\\ No newline at end of file",
      "+after",
      "\\ No newline at end of file",
    ].join("\n"),
  );

  // Verify
  expect(
    fileDiffs[0]?.hunks[0]?.lines.map(({ content, noNewlineAtEnd }) => ({
      content,
      noNewlineAtEnd,
    })),
  ).toEqual([
    { content: "before", noNewlineAtEnd: true },
    { content: "after", noNewlineAtEnd: true },
  ]);
});

it("reads deleted lines that look like file headers as hunk content", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      "diff --git a/notes.md b/notes.md",
      "--- a/notes.md",
      "+++ b/notes.md",
      "@@ -1,2 +1 @@",
      "--- a/separator",
      " kept",
    ].join("\n"),
  );

  // Verify
  expect(
    fileDiffs[0]?.hunks[0]?.lines.map(({ type, content }) => ({
      type,
      content,
    })),
  ).toEqual([
    { type: "deletion", content: "-- a/separator" },
    { type: "context", content: "kept" },
  ]);
});

it("decodes quoted paths with octal escapes", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      'diff --git "a/caf\\303\\251.txt" "b/caf\\303\\251.txt"',
      '--- "a/caf\\303\\251.txt"',
      '+++ "b/caf\\303\\251.txt"',
      "@@ -1 +1 @@",
      "-a",
      "+b",
    ].join("\n"),
  );

  // Verify
  expect(fileDiffs.map(({ path }) => path)).toEqual(["café.txt"]);
});

it("parses several files", () => {
  // Exercise
  const fileDiffs = parseUnifiedDiff(
    [
      "diff --git a/one.txt b/one.txt",
      "--- a/one.txt",
      "+++ b/one.txt",
      "@@ -1 +1 @@",
      "-1",
      "+one",
      "diff --git a/two.txt b/two.txt",
      "--- a/two.txt",
      "+++ b/two.txt",
      "@@ -1 +1 @@",
      "-2",
      "+two",
    ].join("\n"),
  );

  // Verify
  expect(fileDiffs.map(({ path }) => path)).toEqual(["one.txt", "two.txt"]);
});

it("rejects a hunk with fewer lines than its header says", () => {
  // Exercise and verify
  expect(() =>
    parseUnifiedDiff(
      [
        "diff --git a/a.txt b/a.txt",
        "--- a/a.txt",
        "+++ b/a.txt",
        "@@ -1,2 +1,2 @@",
        " only one line",
      ].join("\n"),
    ),
  ).toThrow(DiffParseError);
});

it("rejects a hunk with more lines than its header says", () => {
  // Exercise and verify
  expect(() =>
    parseUnifiedDiff(
      [
        "diff --git a/a.txt b/a.txt",
        "--- a/a.txt",
        "+++ b/a.txt",
        "@@ -1 +1 @@",
        " one",
        " two",
      ].join("\n"),
    ),
  ).toThrow(DiffParseError);
});
