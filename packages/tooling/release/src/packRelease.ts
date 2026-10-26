import { readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import cliReleaseFiles from "./cliReleaseFiles.ts";
import runCommand from "./runCommand.ts";

// Builds and packs the CLI, then runs the packed tarball as npx would.
const cliDirectory = fileURLToPath(new URL("../../../cli/", import.meta.url));
rmSync(cliReleaseFiles.packDirectory, { recursive: true, force: true });
runCommand("pnpm", ["--dir", cliDirectory, "build"]);
runCommand("pnpm", [
  "--dir",
  cliDirectory,
  "pack",
  "--pack-destination",
  ".pack",
]);
const [file] = readdirSync(cliReleaseFiles.packDirectory);
if (!file) {
  throw new Error("pnpm pack wrote no tarball.");
}
runCommand("npx", [
  "--yes",
  `--package=${fileURLToPath(new URL(file, cliReleaseFiles.packDirectory))}`,
  "step-review",
  "--help",
]);
