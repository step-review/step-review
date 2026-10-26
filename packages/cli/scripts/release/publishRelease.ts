import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import compareVersions from "./compareVersions.ts";
import computeIntegrity from "./computeIntegrity.ts";
import packageManifest from "./packageManifest.ts";
import readCommandOutput from "./readCommandOutput.ts";
import readRegistryValue from "./readRegistryValue.ts";
import releaseFiles from "./releaseFiles.ts";
import type ReleasePlan from "./ReleasePlan.ts";
import resolveReleasePlan from "./resolveReleasePlan.ts";
import runCommand from "./runCommand.ts";
import type SealedTarball from "./SealedTarball.ts";

const { name, version: committedVersion } = packageManifest.read();
const plan = JSON.parse(readFileSync(releaseFiles.plan, "utf8")) as ReleasePlan;
const expectedPlan = resolveReleasePlan(committedVersion, process.env);
if (JSON.stringify(plan) !== JSON.stringify(expectedPlan)) {
  throw new Error("The release plan doesn't match this commit.");
}
const sealedTarball = JSON.parse(
  readFileSync(releaseFiles.sealedTarball, "utf8"),
) as SealedTarball;
const tarballUrl = new URL(sealedTarball.file, releaseFiles.packDirectory);
if (
  sealedTarball.version !== plan.version ||
  computeIntegrity(tarballUrl) !== sealedTarball.integrity
) {
  throw new Error("The tarball isn't the one QA tested.");
}

const latestVersion = readRegistryValue(name, "dist-tags.latest");
if (plan.branch) {
  // The registry makes a package's first version `latest`, whatever its tag.
  if (!latestVersion) {
    console.log("Skipped: publish a stable version before branch betas.");
    process.exit(0);
  }
  const branchTip = readCommandOutput("git", [
    "ls-remote",
    "origin",
    `refs/heads/${plan.branch}`,
  ]).split(/\s/u)[0];
  if (branchTip !== plan.commit) {
    console.log(`Skipped: ${plan.branch} has newer commits.`);
    process.exit(0);
  }
} else {
  try {
    readCommandOutput("git", [
      "merge-base",
      "--is-ancestor",
      plan.commit,
      "origin/main",
    ]);
  } catch {
    throw new Error("Stable releases must be tagged on main.");
  }
  if (latestVersion && compareVersions(plan.version, latestVersion) < 0) {
    throw new Error(`${plan.version} is older than latest (${latestVersion}).`);
  }
}

const specifier = `${name}@${plan.version}`;
const publishedIntegrity = readRegistryValue(specifier, "dist.integrity");
if (publishedIntegrity === undefined) {
  runCommand("npm", [
    "publish",
    fileURLToPath(tarballUrl),
    "--tag",
    plan.channel,
    "--access",
    "public",
  ]);
} else if (publishedIntegrity === sealedTarball.integrity) {
  // A re-run of a release whose publish succeeded.
  console.log(`${specifier} is already published.`);
} else {
  throw new Error(`${specifier} is published with different content.`);
}
console.log(`Published ${specifier} under ${plan.channel}.`);
