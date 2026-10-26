import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Runs `git diff` with the options the app expects: notes rely on the 20 lines
 * of context, and the parser on the `a/` and `b/` prefixes and unquoted paths.
 */
export default async function readGitDiff(
  baseCommit: string,
  headCommit: string,
  cwd: string,
): Promise<string> {
  const { stdout } = await execFileAsync(
    "git",
    [
      "-c",
      "core.quotePath=false",
      "diff",
      "--no-color",
      "--no-ext-diff",
      "-M",
      "-U20",
      "--src-prefix=a/",
      "--dst-prefix=b/",
      baseCommit,
      headCommit,
    ],
    { cwd, encoding: "utf8", maxBuffer: Infinity },
  );
  return stdout;
}
