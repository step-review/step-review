import { parseArgs } from "node:util";
import type CommandResult from "./CommandResult.ts";
import build from "./commands/build.ts";
import check from "./commands/check.ts";

const usage = `Usage:
  step-review build <review.json> --output <file.step-review>
    Builds a review file from the review's JSON and the diff between its
    target's base and head commits, run in the current repository. Then
    reports the review's problems.
  step-review check <file.step-review>
    Reports the problems of a review file.`;

export default async function runCli(
  args: string[],
  cwd: string,
): Promise<CommandResult> {
  const [command, ...commandArgs] = args;
  try {
    if (command === "build") {
      const { values, positionals } = parseArgs({
        args: commandArgs,
        allowPositionals: true,
        options: { output: { type: "string", short: "o" } },
      });
      const [dataPath] = positionals;
      if (!dataPath || !values.output || positionals.length > 1) {
        return usageError("build needs one JSON file and --output.");
      }
      return await build(dataPath, values.output, cwd);
    }
    if (command === "check") {
      const { positionals } = parseArgs({
        args: commandArgs,
        allowPositionals: true,
      });
      const [filePath] = positionals;
      if (!filePath || positionals.length > 1) {
        return usageError("check needs one review file.");
      }
      return await check(filePath, cwd);
    }
    if (command === "help" || command === "--help" || command === "-h") {
      return { exitCode: 0, output: usage };
    }
    return usageError(
      command ? `Unknown command \`${command}\`.` : "No command given.",
    );
  } catch (error) {
    // Unknown options and unreadable files: the message says enough, a stack
    // trace would only bury it.
    return {
      exitCode: 2,
      output: error instanceof Error ? error.message : String(error),
    };
  }
}

function usageError(message: string): CommandResult {
  return { exitCode: 2, output: `${message}\n\n${usage}` };
}
