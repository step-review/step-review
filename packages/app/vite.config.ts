import formatjs from "@formatjs/unplugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import emitJsonSchema from "./scripts/emitJsonSchema.ts";

export default defineConfig({
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
    // The share API, served by `pnpm --filter @step-review/share-server dev`.
    proxy: {
      "/api/": {
        target: `http://127.0.0.1:${process.env["SHARE_SERVER_PORT"] ?? 8787}`,
        ws: true,
      },
    },
  },
});
