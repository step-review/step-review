import { mkdirSync, writeFileSync } from "node:fs";
import cliManifest from "./cliManifest.ts";
import cliReleaseFiles from "./cliReleaseFiles.ts";
import resolveReleasePlan from "./resolveReleasePlan.ts";
import workspaceVersion from "./workspaceVersion.ts";

// Sets the version CI builds and publishes, before QA.
const plan = resolveReleasePlan(workspaceVersion.read(), process.env);
cliManifest.setVersion(plan.version);
mkdirSync(new URL(".", cliReleaseFiles.plan), { recursive: true });
writeFileSync(cliReleaseFiles.plan, `${JSON.stringify(plan, null, 2)}\n`);
console.log(`Preparing ${plan.version} for the ${plan.channel} dist-tag.`);
