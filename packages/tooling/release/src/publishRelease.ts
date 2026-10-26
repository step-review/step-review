import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import compareVersions from "./compareVersions.ts";
import isOnMain from "./isOnMain.ts";
import readCommandOutput from "./readCommandOutput.ts";
import readRegistryValue from "./readRegistryValue.ts";
import resolveReleasePlan from "./resolveReleasePlan.ts";
import runCommand from "./runCommand.ts";
import workspaceManifests from "./workspaceManifests.ts";
import workspaceVersion from "./workspaceVersion.ts";

// Builds and publishes every public package: a beta from a branch, a release
// from a `vX.Y.Z` tag.
const plan = resolveReleasePlan(workspaceVersion.read(), process.env);
if (plan.branch) {
  const branchTip = readCommandOutput("git", [
    "ls-remote",
    "origin",
    `refs/heads/${plan.branch}`,
  ]).split(/\s/u)[0];
  if (branchTip !== plan.commit) {
    console.log(`Skipped: ${plan.branch} has newer commits.`);
    process.exit(0);
  }
} else if (!isOnMain(plan.commit)) {
  throw new Error("Releases must be tagged on main.");
}

const publicPackages = workspaceManifests()
  .filter(({ manifest }) => manifest["private"] !== true)
  .map(({ url, manifest }) => ({
    name: String(manifest["name"]),
    directory: fileURLToPath(new URL(".", url)),
  }))
  .filter(({ name }) => {
    const latestVersion = readRegistryValue(name, "dist-tags.latest");
    if (readRegistryValue(`${name}@${plan.version}`, "version")) {
      console.log(`${name}@${plan.version} is already published.`);
      return false;
    }
    // The registry makes a package's first version `latest`, whatever its tag.
    if (plan.branch && !latestVersion) {
      console.log(`Skipped ${name}: publish a release before branch betas.`);
      return false;
    }
    if (
      !plan.branch &&
      latestVersion &&
      compareVersions(plan.version, latestVersion) < 0
    ) {
      throw new Error(
        `${plan.version} is older than ${name}@${latestVersion}.`,
      );
    }
    return true;
  });

workspaceVersion.set(plan.version);
for (const { name, directory } of publicPackages) {
  runCommand("pnpm", ["--filter", name, "run", "--if-present", "build"]);
  // pnpm pack replaces the `workspace:` dependency versions; npm publish then
  // authenticates with the workflow's OIDC token.
  const packDirectory = mkdtempSync(join(tmpdir(), "step-review-release-"));
  runCommand("pnpm", [
    "--dir",
    directory,
    "pack",
    "--pack-destination",
    packDirectory,
  ]);
  const [tarball = ""] = readdirSync(packDirectory);
  runCommand("npm", [
    "publish",
    join(packDirectory, tarball),
    "--tag",
    plan.channel,
    "--access",
    "public",
  ]);
  console.log(`Published ${name}@${plan.version} under ${plan.channel}.`);
}
