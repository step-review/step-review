import { expect, it } from "vitest";
import createFixPrompt from "./createFixPrompt.ts";

it("lists the problems and points the agent to the instructions", () => {
  // Exercise
  const prompt = createFixPrompt(
    "https://step-review.dev",
    "pr-123.step-review",
    ["line 2: Invalid JSON", "Files in no step: `sum.ts`."],
  );

  // Verify
  expect(prompt).toBe(
    [
      "The review file `pr-123.step-review` has these problems:",
      "- line 2: Invalid JSON",
      "- Files in no step: `sum.ts`.",
      "",
      "Fix them and write the review again, following https://step-review.dev/SKILL.md.",
    ].join("\n"),
  );
});
