import CloudflareWorker from "./CloudflareWorker.ts";
import DeployTarget from "./DeployTarget.ts";

await cleanup();

async function cleanup(): Promise<void> {
  if (process.argv.length !== 3) {
    throw new Error("Cleanup requires exactly one PR number.");
  }
  const deployTarget = new DeployTarget(["--pr", process.argv[2]!]);
  if (!(await deployTarget.isCurrent("cleanup"))) {
    throw new Error("Cleanup requires a closed internal PR.");
  }
  await new CloudflareWorker(deployTarget.workerName).delete();
  console.log(`Removed the preview of PR ${deployTarget.pullRequestNumber}.`);
}
