import { fileURLToPath } from "node:url";
import type { TestProject } from "vitest/node";
import { unstable_startWorker } from "wrangler";

/**
 * Starts the share server in the local Workers runtime, once for all tests, and
 * provides its origin as `shareServerOrigin`.
 */
export default async function startShareServer(project: TestProject) {
  const worker = await unstable_startWorker({
    config: fileURLToPath(new URL("../../wrangler.json", import.meta.url)),
    dev: {
      inspector: false,
      persist: false,
      logLevel: "none",
      server: { hostname: "127.0.0.1", port: 0 },
    },
  });
  project.provide("shareServerOrigin", (await worker.url).origin);
  return () => worker.dispose();
}
