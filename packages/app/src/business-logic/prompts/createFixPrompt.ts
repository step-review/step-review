/**
 * Asks the coding agent that wrote a review file to fix the problems the app
 * found in it.
 */
export default function createFixPrompt(
  origin: string,
  fileName: string,
  problems: string[],
): string {
  return [
    `The review file \`${fileName}\` has these problems:`,
    ...problems.map((problem) => `- ${problem}`),
    "",
    `Fix them and write the review again, following ${origin}/SKILL.md.`,
  ].join("\n");
}
