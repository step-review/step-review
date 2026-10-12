import { expect, it } from "vitest";
import detectLanguage from "./detectLanguage.ts";

it.each([
  ["src/App.tsx", "tsx"],
  ["config.yml", "yaml"],
  ["scripts/build.mjs", "javascript"],
  ["docker/Dockerfile", "docker"],
])("detects the language of %s", (path, language) => {
  // Exercise
  const detectedLanguage = detectLanguage(path);

  // Verify
  expect(detectedLanguage).toBe(language);
});

it("returns null for files without a known language", () => {
  // Exercise
  const detectedLanguage = detectLanguage("LICENSE");

  // Verify
  expect(detectedLanguage).toBeNull();
});
