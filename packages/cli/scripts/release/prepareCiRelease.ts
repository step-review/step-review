import { mkdirSync, writeFileSync } from "node:fs";
import packageManifest from "./packageManifest.ts";
import releaseFiles from "./releaseFiles.ts";
import resolveReleasePlan from "./resolveReleasePlan.ts";

// Sets the version CI builds and publishes, before QA.
const plan = resolveReleasePlan(packageManifest.read().version, process.env);
packageManifest.setVersion(plan.version);
mkdirSync(new URL(".", releaseFiles.plan), { recursive: true });
writeFileSync(releaseFiles.plan, `${JSON.stringify(plan, null, 2)}\n`);
console.log(`Preparing ${plan.version} for the ${plan.channel} dist-tag.`);
