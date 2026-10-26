import { readFileSync, writeFileSync } from "node:fs";
import readCommandOutput from "./readCommandOutput.ts";

const repositoryRoot = new URL("../../../../", import.meta.url);

/** The version all the workspace's packages share. */
export default {
  read(): string {
    const versions = new Set(
      manifestUrls().map((manifestUrl) => readManifest(manifestUrl)["version"]),
    );
    const [version] = versions;
    if (versions.size !== 1 || typeof version !== "string") {
      throw new Error("The workspace's packages must share one version.");
    }
    return version;
  },
  set(version: string): void {
    for (const manifestUrl of manifestUrls()) {
      writeFileSync(
        manifestUrl,
        `${JSON.stringify({ ...readManifest(manifestUrl), version }, null, 2)}\n`,
      );
    }
  },
};

function manifestUrls(): URL[] {
  return readCommandOutput("git", [
    "-C",
    repositoryRoot.pathname,
    "ls-files",
    "*package.json",
  ])
    .split("\n")
    .map((path) => new URL(path, repositoryRoot));
}

function readManifest(manifestUrl: URL): Record<string, unknown> {
  return JSON.parse(readFileSync(manifestUrl, "utf8")) as Record<
    string,
    unknown
  >;
}
