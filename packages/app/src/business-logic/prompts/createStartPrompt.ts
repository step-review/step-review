import startPromptPlaceholder from "./startPromptPlaceholder.ts";

/**
 * Editable prompt that asks a coding agent to write a review. The user replaces
 * the placeholder with what to review.
 */
export default function createStartPrompt(origin: string): string {
  return `Review ${startPromptPlaceholder} with ${origin}/SKILL.md.`;
}
