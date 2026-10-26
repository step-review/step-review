import { appendFileSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import compareVersions from "./compareVersions.ts";
import readRegistryValue from "./readRegistryValue.ts";
import resolveReleasePlan from "./resolveReleasePlan.ts";
import runCommand from "./runCommand.ts";
import workspaceManifests from "./workspaceManifests.ts";
import workspaceVersion from "./workspaceVersion.ts";

// Publishes every public package, built beforehand by `pnpm build`: a release
// (`--production`) or a PR preview (`--pr <number> --revision <commit>`).
const plan = resolveReleasePlan(workspaceVersion.read(), process.argv.slice(2));
/** `name@version` of each package available at the plan's version. */
const availablePackages: string[] = [];

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
      availablePackages.push(`${name}@${plan.version}`);
      return false;
    }
    // The registry makes a package's first version `latest`, whatever its tag.
    if (plan.preview && !latestVersion) {
      console.log(`Skipped ${name}: publish a release before PR previews.`);
      return false;
    }
    if (
      !plan.preview &&
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
  availablePackages.push(`${name}@${plan.version}`);
}

// The PR comment shows how to run the preview packages.
if (process.env["GITHUB_OUTPUT"]) {
  appendFileSync(
    process.env["GITHUB_OUTPUT"],
    `packages=${JSON.stringify(availablePackages)}\n`,
  );
}
