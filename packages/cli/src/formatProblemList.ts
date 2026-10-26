import type { ReviewFileProblem } from "@step-review/review-format";

export default function formatProblemList(
  problems: (ReviewFileProblem | string)[],
): string {
  return problems
    .map((problem) => {
      if (typeof problem === "string") {
        return `- ${problem}`;
      }
      return problem.location
        ? `- ${problem.location}: ${problem.message}`
        : `- ${problem.message}`;
    })
    .join("\n");
}
