import startPromptPlaceholder from "./startPromptPlaceholder.ts";

/**
 * Editable prompt that asks a coding agent to write the first round of a
 * review. The user replaces the placeholder with what to review.
 */
export default function createStartPrompt(origin: string): string {
  return [
    `Review ${startPromptPlaceholder} with step-review, following the instructions at ${origin}/SKILL.md.`,
    "Write the review file at the root of the repository. Don't commit it.",
  ].join("\n");
}
