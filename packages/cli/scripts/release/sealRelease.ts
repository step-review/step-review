import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import computeIntegrity from "./computeIntegrity.ts";
import releaseFiles from "./releaseFiles.ts";
import type ReleasePlan from "./ReleasePlan.ts";
import type SealedTarball from "./SealedTarball.ts";

// Records the tarball QA tested, so that the publish job publishes exactly it.
const plan = JSON.parse(readFileSync(releaseFiles.plan, "utf8")) as ReleasePlan;
const files = readdirSync(releaseFiles.packDirectory).filter((file) =>
  file.endsWith(".tgz"),
);
const [file] = files;
if (!file || files.length > 1) {
  throw new Error(`Expected one tarball, found ${files.length}.`);
}
if (!file.endsWith(`-${plan.version}.tgz`)) {
  throw new Error(`The tarball ${file} isn't version ${plan.version}.`);
}
const sealedTarball: SealedTarball = {
  file,
  version: plan.version,
  integrity: computeIntegrity(new URL(file, releaseFiles.packDirectory)),
};
writeFileSync(
  releaseFiles.sealedTarball,
  `${JSON.stringify(sealedTarball, null, 2)}\n`,
);
console.log(`Sealed ${file}.`);
