import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import check from "./check.ts";

it("reports no problems for a review that matches its diff", async () => {
  // Setup SUT
  const directory = mkdtempSync(join(tmpdir(), "step-review-cli-"));

  // Exercise
  writeFileSync(
    join(directory, "fix.step-review"),
    [
      "#step-review:review",
      JSON.stringify({
        version: 3,
        createdAt: "2026-10-11T09:30:00Z",
        target: {
          title: "Fix sum",
          baseCommit: "aaaaaaa",
          headCommit: "bbbbbbb",
        },
        overview: { summary: "Fixes `sum`." },
        steps: [
          {
            id: "fix",
            title: "Fix",
            attention: "high",
            intro: "The fix.",
            files: [{ path: "sum.ts" }],
          },
        ],
      }),
      "#step-review:diff",
      "diff --git a/sum.ts b/sum.ts",
      "--- a/sum.ts",
      "+++ b/sum.ts",
      "@@ -1 +1 @@",
      "-a - b",
      "+a + b",
      "",
    ].join("\n"),
  );
  const result = await check("fix.step-review", directory);

  // Verify
  expect(result).toEqual({
    exitCode: 0,
    output: "fix.step-review has no problems.",
  });
});

it("reports why a file is not a valid review", async () => {
  // Setup SUT
  const directory = mkdtempSync(join(tmpdir(), "step-review-cli-"));

  // Exercise
  writeFileSync(
    join(directory, "fix.step-review"),
    ["#step-review:review", '{ "version": 3, }', "#step-review:diff", ""].join(
      "\n",
    ),
  );
  const result = await check("fix.step-review", directory);

  // Verify
  expect(result).toEqual({
    exitCode: 1,
    output: expect.stringMatching(
      /^fix\.step-review is not a valid review:\n- line 2: Invalid JSON: /u,
    ) as unknown,
  });
});

it("reports the files that are in no step", async () => {
  // Setup SUT
  const directory = mkdtempSync(join(tmpdir(), "step-review-cli-"));

  // Exercise
  writeFileSync(
    join(directory, "fix.step-review"),
    [
      "#step-review:review",
      JSON.stringify({
        version: 3,
        createdAt: "2026-10-11T09:30:00Z",
        target: {
          title: "Fix sum",
          baseCommit: "aaaaaaa",
          headCommit: "bbbbbbb",
        },
        overview: { summary: "Fixes `sum`." },
        steps: [
          {
            id: "fix",
            title: "Fix",
            attention: "high",
            intro: "The fix.",
            files: [{ path: "sum.ts" }],
          },
        ],
      }),
      "#step-review:diff",
      "diff --git a/sum.ts b/sum.ts",
      "--- a/sum.ts",
      "+++ b/sum.ts",
      "@@ -1 +1 @@",
      "-a - b",
      "+a + b",
      "diff --git a/product.ts b/product.ts",
      "--- a/product.ts",
      "+++ b/product.ts",
      "@@ -1 +1 @@",
      "-a / b",
      "+a * b",
      "",
    ].join("\n"),
  );
  const result = await check("fix.step-review", directory);

  // Verify
  expect(result).toEqual({
    exitCode: 1,
    output:
      "fix.step-review has these problems:\n- Files in no step: `product.ts`.",
  });
});
