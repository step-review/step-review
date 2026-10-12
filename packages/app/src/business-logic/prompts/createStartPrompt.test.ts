import { expect, it } from "vitest";
import createStartPrompt from "./createStartPrompt.ts";

it("points the agent to the instructions hosted on the given origin", () => {
  // Exercise
  const prompt = createStartPrompt("https://step-review.dev");

  // Verify
  expect(prompt).toBe(
    [
      "Review PASTE_PR_LINK with step-review, following the instructions at https://step-review.dev/SKILL.md.",
      "Write the review file at the root of the repository. Don't commit it.",
    ].join(" "),
  );
});
