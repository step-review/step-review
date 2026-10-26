import { defineConfig } from "vitest/config";

// Bundles the CLI with the review format into one dependency-free file, so
// that `npx` has a single package to download.
export default defineConfig({
  build: {
    ssr: "src/main.ts",
    target: "node20",
    outDir: "dist",
    rolldownOptions: {
      output: {
        entryFileNames: "step-review.js",
        banner: "#!/usr/bin/env node",
      },
    },
  },
  ssr: {
    noExternal: true,
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
