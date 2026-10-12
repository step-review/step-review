import { appendFileSync, unlinkSync, writeFileSync } from "node:fs";
import wranglerConfig from "../wrangler.json" with { type: "json" };
import DeployTarget from "./DeployTarget.ts";
import shell from "./shell.ts";

await deploy();

/** Deploys the built app (`dist`) as a static-assets Worker. */
async function deploy(): Promise<void> {
  const deployTarget = new DeployTarget(process.argv.slice(2));
  output(false);
  if (!(await deployTarget.isCurrent("deploy"))) {
    console.log("Skipping a stale or ineligible revision.");
    return;
  }
  const configPath = "wrangler.deploy.json";
  writeFileSync(
    configPath,
    JSON.stringify({
      ...wranglerConfig,
      name: deployTarget.workerName,
      routes: [{ pattern: deployTarget.hostname, custom_domain: true }],
    }),
  );
  try {
    await shell`pnpm exec wrangler deploy --config ${configPath}`
      .quiet(false)
      .verbose();
    output(true);
    console.log(`Deployed https://${deployTarget.hostname}`);
  } finally {
    unlinkSync(configPath);
  }
}

function output(deployed: boolean): void {
  if (process.env["GITHUB_OUTPUT"]) {
    appendFileSync(process.env["GITHUB_OUTPUT"], `deployed=${deployed}\n`);
  }
}
