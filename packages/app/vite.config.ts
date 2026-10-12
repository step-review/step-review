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
  },
});
