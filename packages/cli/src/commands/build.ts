import {
  checkReviewFile,
  createReviewFileText,
  parseReviewFile,
} from "@step-review/review-format";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type CommandResult from "../CommandResult.ts";
import formatProblemList from "../formatProblemList.ts";
import readGitDiff from "../readGitDiff.ts";

/**
 * Writes a review file from the review's JSON and the diff between its target
 * commits, then reports its problems. Writes nothing when the app couldn't open
 * the file.
 */
export default async function build(
  dataPath: string,
  outputPath: string,
  cwd: string,
): Promise<CommandResult> {
  const dataText = await readFile(resolve(cwd, dataPath), "utf8");
  let data: unknown;
  try {
    data = JSON.parse(dataText);
  } catch (error) {
    return {
      exitCode: 1,
      output: `${dataPath} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  // Validates the data before reading the commits from it.
  const dataResult = parseReviewFile(createReviewFileText(data, ""));
  if (!dataResult.success) {
    return {
      exitCode: 1,
      output: `${dataPath} is not a valid review:\n${formatProblemList(dataResult.problems)}`,
    };
  }
  const { baseCommit, headCommit } = dataResult.reviewFile.data.target;
  let diffText: string;
  try {
    diffText = await readGitDiff(baseCommit, headCommit, cwd);
  } catch (error) {
    return {
      exitCode: 1,
      output: `git diff ${baseCommit} ${headCommit} failed: ${describeGitError(error)}`,
    };
  }
  const text = createReviewFileText(data, diffText);
  const result = parseReviewFile(text);
  if (!result.success) {
    return {
      exitCode: 1,
      output: `The review file is not valid:\n${formatProblemList(result.problems)}`,
    };
  }
  await writeFile(resolve(cwd, outputPath), text);
  const warnings = checkReviewFile(result.reviewFile);
  if (warnings.length > 0) {
    return {
      exitCode: 1,
      output: `Wrote ${outputPath}, but the review has these problems. Fix them in ${dataPath} and build again:\n${formatProblemList(warnings)}`,
    };
  }
  return {
    exitCode: 0,
    output: `Wrote ${outputPath}. The review has no problems.`,
  };
}

function describeGitError(error: unknown): string {
  // execFile's errors keep git's own explanation in `stderr`.
  if (
    error instanceof Error &&
    "stderr" in error &&
    typeof error.stderr === "string" &&
    error.stderr.trim() !== ""
  ) {
    return error.stderr.trim();
  }
  return error instanceof Error ? error.message : String(error);
}
