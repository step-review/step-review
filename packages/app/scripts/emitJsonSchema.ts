import { createJsonSchema } from "@step-review/review-format";
import type { Plugin } from "vite";

const schemaPath = "/schema/v3.json";

/**
 * Publishes the review format's JSON Schema next to the app: emitted on build,
 * served by the dev server.
 */
export default function emitJsonSchema(): Plugin {
  const schemaJson = () =>
    `${JSON.stringify(createJsonSchema(`https://step-review.dev${schemaPath}`), null, 2)}\n`;
  return {
    name: "step-review:emit-json-schema",
    configureServer(server) {
      server.middlewares.use(schemaPath, (_request, response) => {
        response.setHeader("Content-Type", "application/json");
        response.end(schemaJson());
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: schemaPath.slice(1),
        source: schemaJson(),
      });
    },
  };
}
