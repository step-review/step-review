import { readFileSync, writeFileSync } from "node:fs";

const manifestUrl = new URL("../../../cli/package.json", import.meta.url);

/** The CLI's `package.json`, whose version CI sets for branch betas. */
export default {
  readName(): string {
    return (JSON.parse(readFileSync(manifestUrl, "utf8")) as { name: string })
      .name;
  },
  setVersion(version: string): void {
    const manifest = JSON.parse(readFileSync(manifestUrl, "utf8")) as Record<
      string,
      unknown
    >;
    writeFileSync(
      manifestUrl,
      `${JSON.stringify({ ...manifest, version }, null, 2)}\n`,
    );
  },
};
