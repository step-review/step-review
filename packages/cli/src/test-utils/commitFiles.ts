import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

/** Writes the files and commits them, returning the commit's hash. */
export default function commitFiles(
  repository: string,
  files: Record<string, string>,
): string {
  for (const [path, content] of Object.entries(files)) {
    writeFileSync(join(repository, path), content);
  }
  const git = (args: string[]) =>
    execFileSync(
      "git",
      [
        "-c",
        "user.name=Test",
        "-c",
        "user.email=test@example.com",
        "-c",
        "commit.gpgSign=false",
        "-c",
        "core.hooksPath=/dev/null",
        ...args,
      ],
      { cwd: repository, encoding: "utf8" },
    );
  git(["add", "--all"]);
  git(["commit", "--quiet", "--message", "Commit"]);
  return git(["rev-parse", "HEAD"]).trim();
}
