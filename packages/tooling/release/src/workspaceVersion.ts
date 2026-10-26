import { writeFileSync } from "node:fs";
import workspaceManifests from "./workspaceManifests.ts";

/** The version all the workspace's packages share. */
export default {
  read(): string {
    const versions = new Set(
      workspaceManifests().map(({ manifest }) => manifest["version"]),
    );
    const [version] = versions;
    if (versions.size !== 1 || typeof version !== "string") {
      throw new Error("The workspace's packages must share one version.");
    }
    return version;
  },
  set(version: string): void {
    for (const { url, manifest } of workspaceManifests()) {
      writeFileSync(
        url,
        `${JSON.stringify({ ...manifest, version }, null, 2)}\n`,
      );
    }
  },
};
