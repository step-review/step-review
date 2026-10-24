import { expect, it } from "vitest";
import createStartPrompt from "./createStartPrompt.ts";

it("points the agent to the instructions hosted on the given origin", () => {
  // Exercise
  const prompt = createStartPrompt("https://step-review.dev");

  // Verify
  expect(prompt).toBe(
    "Review PR_LINK_HERE with https://step-review.dev/SKILL.md.",
  );
});
