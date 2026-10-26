import { checkReviewFile, parseReviewFile } from "@step-review/review-format";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type CommandResult from "../CommandResult.ts";
import formatProblemList from "../formatProblemList.ts";

/** Reports the problems of a review file, as the app would. */
export default async function check(
  filePath: string,
  cwd: string,
): Promise<CommandResult> {
  const text = await readFile(resolve(cwd, filePath), "utf8");
  const result = parseReviewFile(text);
  if (!result.success) {
    return {
      exitCode: 1,
      output: `${filePath} is not a valid review:\n${formatProblemList(result.problems)}`,
    };
  }
  const warnings = checkReviewFile(result.reviewFile);
  if (warnings.length > 0) {
    return {
      exitCode: 1,
      output: `${filePath} has these problems:\n${formatProblemList(warnings)}`,
    };
  }
  return { exitCode: 0, output: `${filePath} has no problems.` };
}
