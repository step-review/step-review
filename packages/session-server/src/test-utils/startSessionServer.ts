import { fileURLToPath } from "node:url";
import type { TestProject } from "vitest/node";
import { unstable_startWorker } from "wrangler";

/**
 * Starts the session server in the local Workers runtime, once for all tests,
 * and provides its origin as `sessionServerOrigin`.
 */
export default async function startSessionServer(project: TestProject) {
  const worker = await unstable_startWorker({
    config: fileURLToPath(new URL("../../wrangler.json", import.meta.url)),
    bindings: {
      // The tests upload more reviews than the production limit allows.
      REVIEW_UPLOADS: {
        type: "ratelimit",
        namespace_id: "1001",
        simple: { limit: 1000, period: 60 },
      },
    },
    dev: {
      inspector: false,
      persist: false,
      logLevel: "none",
      server: { hostname: "127.0.0.1", port: 0 },
    },
  });
  project.provide("sessionServerOrigin", (await worker.url).origin);
  return () => worker.dispose();
}
