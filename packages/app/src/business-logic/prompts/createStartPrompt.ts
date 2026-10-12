import reviewFileName from "./reviewFileName.ts";
import type ReviewTargetInput from "./ReviewTargetInput.ts";

/** Prompt that asks a coding agent to write the first round of a review. */
export default function createStartPrompt(
  { target, focus }: ReviewTargetInput,
  origin: string,
): string {
  const trimmedTarget = target.trim();
  const isLink = /^https?:\/\//u.test(trimmedTarget);
  const fileName = reviewFileName(trimmedTarget);
  return [
    `Review ${isLink ? trimmedTarget : `the changes in \`${trimmedTarget}\``} with step-review, following the instructions at ${origin}/SKILL.md.`,
    `Write the review to \`${fileName}\` at the root of the repository. Don't commit it.`,
    ...(focus.trim() ? ["", `Focus on: ${focus.trim()}`] : []),
  ].join("\n");
}
