import { expect, it } from "vitest";
import createStartPrompt from "./createStartPrompt.ts";

it("asks to review a PR link and names the file after the PR", () => {
  // Exercise
  const prompt = createStartPrompt(
    { target: "https://github.com/acme/app/pull/107", focus: "" },
    "https://step-review.dev",
  );

  // Verify
  expect(prompt).toBe(
    [
      "Review https://github.com/acme/app/pull/107 with step-review, following the instructions at https://step-review.dev/SKILL.md.",
      "Write the review to `pr-107.step-review` at the root of the repository. Don't commit it.",
    ].join("\n"),
  );
});

it("asks to review a commit range and adds the focus", () => {
  // Exercise
  const prompt = createStartPrompt(
    { target: "main..feature/ids", focus: "error handling" },
    "https://step-review.dev",
  );

  // Verify
  expect(prompt).toBe(
    [
      "Review the changes in `main..feature/ids` with step-review, following the instructions at https://step-review.dev/SKILL.md.",
      "Write the review to `main-feature-ids.step-review` at the root of the repository. Don't commit it.",
      "",
      "Focus on: error handling",
    ].join("\n"),
  );
});
