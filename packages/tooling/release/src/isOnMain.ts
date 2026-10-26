import { execFileSync } from "node:child_process";

/** Whether the commit is on `origin/main`, which needs the full history. */
export default function isOnMain(commit: string): boolean {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", commit, "origin/main"]);
    return true;
  } catch {
    return false;
  }
}
