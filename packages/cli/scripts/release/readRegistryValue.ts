import { execFileSync } from "node:child_process";

/**
 * Reads a field of a package version from the npm registry, e.g.
 * `dist.integrity`. Returns undefined when the package or version doesn't
 * exist.
 */
export default function readRegistryValue(
  specifier: string,
  field: string,
): string | undefined {
  try {
    const output = execFileSync("npm", ["view", specifier, field], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    return output === "" ? undefined : output;
  } catch (error) {
    // npm fails with E404 for a package or version that doesn't exist.
    if (
      error instanceof Error &&
      "stderr" in error &&
      String(error.stderr).includes("E404")
    ) {
      return undefined;
    }
    throw error;
  }
}
