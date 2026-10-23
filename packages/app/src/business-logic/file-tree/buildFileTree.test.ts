import { expect, it } from "vitest";
import buildFileTree from "./buildFileTree.ts";

it("merges a folder whose only child is a folder", () => {
  // Exercise
  const fileTree = buildFileTree(
    ["packages/app/src/a.ts", "packages/app/src/b.ts"],
    (path) => path,
  );

  // Verify
  expect(fileTree).toEqual([
    {
      kind: "folder",
      path: "packages/app/src",
      label: "packages/app/src",
      children: [
        { kind: "file", label: "a.ts", file: "packages/app/src/a.ts" },
        { kind: "file", label: "b.ts", file: "packages/app/src/b.ts" },
      ],
    },
  ]);
});

it("splits folders where paths diverge, merging each branch", () => {
  // Exercise
  const fileTree = buildFileTree(
    ["packages/cli/src/cli.ts", "packages/open/src/worker.ts"],
    (path) => path,
  );

  // Verify
  expect(fileTree).toEqual([
    {
      kind: "folder",
      path: "packages",
      label: "packages",
      children: [
        {
          kind: "folder",
          path: "packages/cli/src",
          label: "cli/src",
          children: [
            {
              kind: "file",
              label: "cli.ts",
              file: "packages/cli/src/cli.ts",
            },
          ],
        },
        {
          kind: "folder",
          path: "packages/open/src",
          label: "open/src",
          children: [
            {
              kind: "file",
              label: "worker.ts",
              file: "packages/open/src/worker.ts",
            },
          ],
        },
      ],
    },
  ]);
});

it("keeps a folder that holds a file next to a subfolder", () => {
  // Exercise
  const fileTree = buildFileTree(
    ["src/index.ts", "src/lib/sum.ts"],
    (path) => path,
  );

  // Verify
  expect(fileTree).toEqual([
    {
      kind: "folder",
      path: "src",
      label: "src",
      children: [
        { kind: "file", label: "index.ts", file: "src/index.ts" },
        {
          kind: "folder",
          path: "src/lib",
          label: "lib",
          children: [{ kind: "file", label: "sum.ts", file: "src/lib/sum.ts" }],
        },
      ],
    },
  ]);
});

it("keeps the files' order and puts root files at the top level", () => {
  // Exercise
  const fileTree = buildFileTree(
    ["b.json", "src/a.ts", "a.json"],
    (path) => path,
  );

  // Verify
  expect(fileTree.map((node) => node.label)).toEqual([
    "b.json",
    "src",
    "a.json",
  ]);
});
