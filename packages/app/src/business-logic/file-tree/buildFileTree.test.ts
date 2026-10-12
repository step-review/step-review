import { parseReviewFile } from "@step-review/review-format";
import { expect, it } from "vitest";
import buildRoundView from "../rounds/buildRoundView.ts";
import buildFileTree from "./buildFileTree.ts";
import type FileTreeNode from "./FileTreeNode.ts";

function labels(nodes: FileTreeNode[]): unknown[] {
  return nodes.map((node) =>
    node.children.length > 0
      ? { [node.label]: labels(node.children) }
      : node.label,
  );
}

it("merges folders with a single child folder", () => {
  // Setup SUT
  const result = parseReviewFile(
    [
      "#step-review:round",
      JSON.stringify({
        version: 1,
        createdAt: "2026-10-11T09:30:00Z",
        target: {
          title: "Change",
          baseCommit: "aaaaaaa",
          headCommit: "bbbbbbb",
        },
        overview: { summary: "Changes." },
        steps: [
          {
            id: "one",
            title: "One",
            attention: "normal",
            intro: "One.",
            files: [{ path: "src/app/a.ts" }, { path: "src/app/b.ts" }],
          },
        ],
      }),
      "#step-review:diff",
      "diff --git a/src/app/a.ts b/src/app/a.ts",
      "--- a/src/app/a.ts",
      "+++ b/src/app/a.ts",
      "@@ -1 +1 @@",
      "-a",
      "+A",
      "diff --git a/src/app/b.ts b/src/app/b.ts",
      "--- a/src/app/b.ts",
      "+++ b/src/app/b.ts",
      "@@ -1 +1 @@",
      "-b",
      "+B",
    ].join("\n"),
  );
  if (!result.success) {
    throw new Error("Invalid review file.");
  }
  const roundView = buildRoundView(result.reviewFile, 1)!;

  // Exercise
  const fileTree = buildFileTree(roundView);

  // Verify
  expect(labels(fileTree)).toEqual([{ "src/app": ["a.ts", "b.ts"] }]);
});
