import { createHash } from "node:crypto";
import type ReleasePlan from "./ReleasePlan.ts";

/**
 * A `cli-vX.Y.Z` tag releases the committed version to `latest`. A branch
 * publishes a beta of it, under a dist-tag named after the branch.
 */
export default function resolveReleasePlan(
  committedVersion: string,
  environment: NodeJS.ProcessEnv,
): ReleasePlan {
  if (!/^\d+\.\d+\.\d+$/u.test(committedVersion)) {
    throw new Error(
      `The committed version must be X.Y.Z, not ${committedVersion}.`,
    );
  }
  const commit = environment["GITHUB_SHA"] ?? "";
  const refName = environment["GITHUB_REF_NAME"] ?? "";
  if (environment["GITHUB_REF_TYPE"] === "tag") {
    if (refName !== `cli-v${committedVersion}`) {
      throw new Error(
        `The tag ${refName} doesn't match the version ${committedVersion}.`,
      );
    }
    return { version: committedVersion, channel: "latest", commit };
  }
  const slug =
    refName
      .toLowerCase()
      .replaceAll(/[^a-z0-9-]+/gu, "-")
      .replaceAll(/^-+|-+$/gu, "")
      .slice(0, 40) || "branch";
  const hash = createHash("sha256").update(refName).digest("hex").slice(0, 8);
  const identifier = `${slug}-${hash}`;
  // npm rejects dist-tags that read as versions or ranges; `latest` and
  // `branch-*` are taken by stable releases and the fallback names.
  const branchCanBeDistTag =
    /^[a-z_][a-z0-9._-]*$/iu.test(refName) &&
    !/^v\d/iu.test(refName) &&
    !/^(?:latest$|branch-)/iu.test(refName);
  return {
    version: `${committedVersion}-beta.${identifier}.sha${commit.slice(0, 12)}`,
    channel: branchCanBeDistTag ? refName : `branch-${identifier}`,
    commit,
    branch: refName,
  };
}
