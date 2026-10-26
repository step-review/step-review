import { readFileSync } from "node:fs";
import readCommandOutput from "./readCommandOutput.ts";

const repositoryRoot = new URL("../../../../", import.meta.url);

/** The `package.json` of the root and of every workspace package. */
export default function workspaceManifests(): {
  url: URL;
  manifest: Record<string, unknown>;
}[] {
  return readCommandOutput("git", [
    "-C",
    repositoryRoot.pathname,
    "ls-files",
    "*package.json",
  ])
    .split("\n")
    .map((path) => {
      const url = new URL(path, repositoryRoot);
      return {
        url,
        manifest: JSON.parse(readFileSync(url, "utf8")) as Record<
          string,
          unknown
        >,
      };
    });
}
