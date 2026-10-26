import formatjs from "@formatjs/unplugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import appPackage from "./package.json" with { type: "json" };
import emitJsonSchema from "./scripts/emitJsonSchema.ts";

export default defineConfig({
  define: {
    // Release builds get the release's version; the others say what they are.
    __APP_VERSION__: JSON.stringify(
      process.env["APP_VERSION"] ?? `${appPackage.version}-dev`,
    ),
  },
  plugins: [
    react(),
    formatjs({
      idInterpolationPattern: "[name].[ext]_[sha512:contenthash:base64:6]",
      removeDefaultMessage: true,
      flatten: false,
    }),
    emitJsonSchema(),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@formatjs/icu-messageformat-parser":
        "@formatjs/icu-messageformat-parser/no-parser.js",
    },
  },
  server: {
    host: "127.0.0.1",
    // Lets parallel dev servers run on assigned ports.
    port: process.env["PORT"] ? Number(process.env["PORT"]) : 5173,
    // The session API, from `pnpm --filter @step-review/session-server dev`.
    proxy: {
      "/api/": {
        target: `http://127.0.0.1:${process.env["SESSION_SERVER_PORT"] ?? 8787}`,
        ws: true,
      },
    },
  },
});
