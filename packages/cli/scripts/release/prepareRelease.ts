import { readFileSync } from "node:fs";
import compareVersions from "./compareVersions.ts";
import packageManifest from "./packageManifest.ts";
import readCommandOutput from "./readCommandOutput.ts";
import runCommand from "./runCommand.ts";

// Prepares a stable release on main: sets the version, runs QA, commits and
// tags. Pushing main and the tag publishes it.
const version = process.argv[2]?.replace(/^v/u, "");
if (!version || !/^\d+\.\d+\.\d+$/u.test(version)) {
  throw new Error("Usage: pnpm release:prepare X.Y.Z");
}
if (readCommandOutput("git", ["branch", "--show-current"]) !== "main") {
  throw new Error("Prepare releases on main.");
}
if (readCommandOutput("git", ["status", "--porcelain"]) !== "") {
  throw new Error("Commit or stash your changes first.");
}
const tag = `cli-v${version}`;
if (readCommandOutput("git", ["tag", "--list", tag]) !== "") {
  throw new Error(`The tag ${tag} already exists.`);
}
if (compareVersions(version, packageManifest.read().version) < 0) {
  throw new Error(`${version} is older than the current version.`);
}
const changelog = readFileSync(
  new URL("../../CHANGELOG.md", import.meta.url),
  "utf8",
);
if (!changelog.includes(`## ${version}\n`)) {
  throw new Error(`Add a "## ${version}" section to CHANGELOG.md first.`);
}
packageManifest.setVersion(version);
runCommand("pnpm", ["--dir", "../..", "qa"]);
runCommand("git", ["add", "package.json"]);
if (readCommandOutput("git", ["diff", "--cached", "--name-only"]) !== "") {
  runCommand("git", ["commit", "--message", `Release the CLI ${version}`]);
}
runCommand("git", ["tag", "--annotate", tag, "--message", tag]);
console.log(
  `Prepared ${tag}. Publish it with: git push --atomic origin main ${tag}`,
);
