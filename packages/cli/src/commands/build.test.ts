import { parseReviewFile } from "@step-review/review-format";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import commitFiles from "../test-utils/commitFiles.ts";
import createGitRepository from "../test-utils/createGitRepository.ts";
import build from "./build.ts";

it("writes a review file with the diff between the target's commits", async () => {
  // Setup SUT
  const repository = createGitRepository();
  const baseCommit = commitFiles(repository, { "sum.ts": "a - b\n" });
  const headCommit = commitFiles(repository, { "sum.ts": "a + b\n" });

  // Exercise
  writeFileSync(
    join(repository, "review.json"),
    JSON.stringify({
      version: 3,
      createdAt: "2026-10-11T09:30:00Z",
      target: { title: "Fix sum", baseCommit, headCommit },
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
  );
  const result = await build("review.json", "fix.step-review", repository);

  // Verify
  const parseResult = parseReviewFile(
    readFileSync(join(repository, "fix.step-review"), "utf8"),
  );
  expect({
    exitCode: result.exitCode,
    diffLines:
      parseResult.success &&
      parseResult.reviewFile.diff[0]?.hunks[0]?.lines.map((line) => [
        line.type,
        line.content,
      ]),
  }).toEqual({
    exitCode: 0,
    diffLines: [
      ["deletion", "a - b"],
      ["addition", "a + b"],
    ],
  });
});

it("reports invalid JSON without writing the review file", async () => {
  // Setup SUT
  const repository = createGitRepository();

  // Exercise
  writeFileSync(
    join(repository, "review.json"),
    '{ "overview": { "summary": "First line\nSecond line" } }',
  );
  const result = await build("review.json", "fix.step-review", repository);

  // Verify
  expect({
    result,
    written: existsSync(join(repository, "fix.step-review")),
  }).toEqual({
    result: {
      exitCode: 1,
      output: expect.stringContaining(
        "review.json is not valid JSON: Bad control character",
      ) as unknown,
    },
    written: false,
  });
});

it("reports the fields that don't match the schema", async () => {
  // Setup SUT
  const repository = createGitRepository();
  const baseCommit = commitFiles(repository, { "sum.ts": "a - b\n" });
  const headCommit = commitFiles(repository, { "sum.ts": "a + b\n" });

  // Exercise
  writeFileSync(
    join(repository, "review.json"),
    JSON.stringify({
      version: 3,
      createdAt: "2026-10-11T09:30:00Z",
      target: { title: "Fix sum", baseCommit, headCommit },
      overview: { summary: "Fixes `sum`." },
      steps: [
        {
          id: "fix",
          title: "Fix",
          attention: "urgent",
          intro: "The fix.",
          files: [{ path: "sum.ts" }],
        },
      ],
    }),
  );
  const result = await build("review.json", "fix.step-review", repository);

  // Verify
  expect(result).toEqual({
    exitCode: 1,
    output: expect.stringMatching(
      /^review\.json is not a valid review:\n- steps\[0\]\.attention: /u,
    ) as unknown,
  });
});

it("writes the review file and reports the notes that don't match the diff", async () => {
  // Setup SUT
  const repository = createGitRepository();
  const baseCommit = commitFiles(repository, { "sum.ts": "a - b\n" });
  const headCommit = commitFiles(repository, { "sum.ts": "a + b\n" });

  // Exercise
  writeFileSync(
    join(repository, "review.json"),
    JSON.stringify({
      version: 3,
      createdAt: "2026-10-11T09:30:00Z",
      target: { title: "Fix sum", baseCommit, headCommit },
      overview: { summary: "Fixes `sum`." },
      steps: [
        {
          id: "fix",
          title: "Fix",
          attention: "high",
          intro: "The fix.",
          files: [
            {
              path: "sum.ts",
              notes: [
                {
                  id: "n1",
                  kind: "explainer",
                  anchor: { side: "new", line: 1, text: "a * b" },
                  body: "Adds instead of subtracting.",
                },
              ],
            },
          ],
        },
      ],
    }),
  );
  const result = await build("review.json", "fix.step-review", repository);

  // Verify
  expect({
    result,
    written: existsSync(join(repository, "fix.step-review")),
  }).toEqual({
    result: {
      exitCode: 1,
      output: expect.stringMatching(
        /^Wrote fix\.step-review, but the review has these problems\. Fix them in review\.json and build again:\n- .*n1/u,
      ) as unknown,
    },
    written: true,
  });
});

it("reports a commit that is not in the repository", async () => {
  // Setup SUT
  const repository = createGitRepository();
  const headCommit = commitFiles(repository, { "sum.ts": "a + b\n" });

  // Exercise
  writeFileSync(
    join(repository, "review.json"),
    JSON.stringify({
      version: 3,
      createdAt: "2026-10-11T09:30:00Z",
      target: { title: "Fix sum", baseCommit: "0123456789abcdef", headCommit },
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
  );
  const result = await build("review.json", "fix.step-review", repository);

  // Verify
  expect(result).toEqual({
    exitCode: 1,
    output: expect.stringContaining("git diff 0123456789abcdef") as unknown,
  });
});
