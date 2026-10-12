import type { ReviewTarget } from "@step-review/review-format";

/** Prompt that asks a coding agent to append a round to a review. */
export default function createNextRoundPrompt(
  fileName: string,
  reviewTarget: ReviewTarget,
  origin: string,
): string {
  const target =
    reviewTarget.url ??
    (reviewTarget.headRef
      ? `\`${reviewTarget.headRef}\``
      : `"${reviewTarget.title}"`);
  return [
    `${target} changed since the last step-review round. Add a new round to \`${fileName}\`, following the instructions at ${origin}/SKILL.md.`,
    "Don't change the existing rounds, and don't commit the file.",
  ].join("\n");
}
