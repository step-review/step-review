import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

/** The tarball's integrity, as the registry reports it in `dist.integrity`. */
export default function computeIntegrity(tarballPath: string | URL): string {
  return `sha512-${createHash("sha512").update(readFileSync(tarballPath)).digest("base64")}`;
}
