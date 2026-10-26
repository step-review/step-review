import { readFileSync } from "node:fs";
import compareVersions from "./compareVersions.ts";
import readCommandOutput from "./readCommandOutput.ts";
import runCommand from "./runCommand.ts";
import workspaceVersion from "./workspaceVersion.ts";

// Prepares a release on main: sets the version of every package, runs QA,
// commits and tags. Pushing the tag deploys the app and publishes the CLI.
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
const tag = `v${version}`;
if (readCommandOutput("git", ["tag", "--list", tag]) !== "") {
  throw new Error(`The tag ${tag} already exists.`);
}
if (compareVersions(version, workspaceVersion.read()) < 0) {
  throw new Error(`${version} is older than the current version.`);
}
const changelog = readFileSync(
  new URL("../../../../CHANGELOG.md", import.meta.url),
  "utf8",
);
if (!changelog.includes(`## ${version}\n`)) {
  throw new Error(`Add a "## ${version}" section to CHANGELOG.md first.`);
}
workspaceVersion.set(version);
runCommand("pnpm", ["qa"]);
runCommand("git", ["add", "--update"]);
if (readCommandOutput("git", ["diff", "--cached", "--name-only"]) !== "") {
  runCommand("git", ["commit", "--message", `Release ${version}`]);
}
runCommand("git", ["tag", "--annotate", tag, "--message", tag]);
console.log(
  `Prepared ${tag}. Release it with: git push --atomic origin main ${tag}`,
);
