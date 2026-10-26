import { execFileSync } from "node:child_process";

export default function readCommandOutput(
  command: string,
  args: string[],
): string {
  return execFileSync(command, args, { encoding: "utf8" }).trim();
}
