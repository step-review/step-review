import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Creates an empty Git repository in a new temporary directory. */
export default function createGitRepository(): string {
  const directory = mkdtempSync(join(tmpdir(), "step-review-cli-"));
  execFileSync("git", ["init", "--quiet"], { cwd: directory });
  return directory;
}
