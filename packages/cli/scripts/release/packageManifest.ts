import { readFileSync, writeFileSync } from "node:fs";

const manifestPath = new URL("../../package.json", import.meta.url);

/** Reads and writes the CLI's `package.json`. */
export default {
  read(): { name: string; version: string } {
    return JSON.parse(readFileSync(manifestPath, "utf8")) as {
      name: string;
      version: string;
    };
  },
  setVersion(version: string): void {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<
      string,
      unknown
    >;
    manifest["version"] = version;
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  },
};
