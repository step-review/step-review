import { execFileSync } from "node:child_process";

/** Runs a command, showing its output. */
export default function runCommand(command: string, args: string[]): void {
  execFileSync(command, args, { stdio: "inherit" });
}
