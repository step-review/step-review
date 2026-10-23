import { expect, it } from "vitest";
import resolveFileIcon from "./resolveFileIcon.ts";

it("prefers the icon for the file name over the one for its extension", () => {
  // Exercise
  const fileIcon = resolveFileIcon("packages/app/package.json", {
    file: "file",
    fileNames: { "package.json": "nodejs" },
    fileExtensions: { json: "json" },
    light: {},
  });

  // Verify
  expect(fileIcon).toEqual({ iconName: "nodejs", lightIconName: "nodejs" });
});

it("prefers the icon for the longest extension", () => {
  // Exercise
  const fileIcon = resolveFileIcon("src/sum.test.ts", {
    file: "file",
    fileNames: {},
    fileExtensions: { "test.ts": "test-ts", ts: "typescript" },
    light: {},
  });

  // Verify
  expect(fileIcon).toEqual({ iconName: "test-ts", lightIconName: "test-ts" });
});

it("matches file names and extensions regardless of case", () => {
  // Exercise
  const fileIcon = resolveFileIcon("docs/README.MD", {
    file: "file",
    fileNames: {},
    fileExtensions: { md: "markdown" },
    light: {},
  });

  // Verify
  expect(fileIcon).toEqual({
    iconName: "markdown",
    lightIconName: "markdown",
  });
});

it("uses the light icon that replaces the matched one", () => {
  // Exercise
  const fileIcon = resolveFileIcon(".github/workflows/ci.yml", {
    file: "file",
    fileNames: {},
    fileExtensions: { yml: "yaml" },
    light: { fileExtensions: { yml: "yaml_light" } },
  });

  // Verify
  expect(fileIcon).toEqual({ iconName: "yaml", lightIconName: "yaml_light" });
});

it("falls back to the generic file icon", () => {
  // Exercise
  const fileIcon = resolveFileIcon("pr-7.step-review", {
    file: "file",
    fileNames: {},
    fileExtensions: { ts: "typescript" },
    light: {},
  });

  // Verify
  expect(fileIcon).toEqual({ iconName: "file", lightIconName: "file" });
});
