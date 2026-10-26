import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: "node",
            include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
            exclude: ["src/**/*.browser.test.{ts,tsx}"],
            // For the session connection tests, which talk to the real server.
            globalSetup: ["@step-review/session-server/test-server"],
          },
        },
        {
          extends: true,
          test: {
            name: "browser",
            include: ["src/**/*.browser.test.{ts,tsx}"],
            browser: {
              enabled: true,
              provider: playwright(),
              headless: true,
              screenshotFailures: false,
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  }),
);
