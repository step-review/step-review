import { expect, it } from "vitest";
import resolveFileIcon from "./resolveFileIcon.ts";

it("prefers the icon for the file name over the one for its extension", () => {
  // Exercise
  const fileIcon = resolveFileIcon(
    "packages/app/package.json",
    {
      iconDefinitions: {
        _default: { fontCharacter: "\\E001" },
        _npm: { fontCharacter: "\\E002", fontColor: "#cc3e44" },
        _json: { fontCharacter: "\\E003", fontColor: "#cbcb41" },
      },
      file: "_default",
      fileNames: { "package.json": "_npm" },
      fileExtensions: { json: "_json" },
      languageIds: {},
      light: {},
    },
    { fileNames: {}, fileExtensions: {} },
  );

  // Verify
  expect(fileIcon.glyph).toEqual({ character: "", color: "#cc3e44" });
});

it("prefers the icon for the longest extension", () => {
  // Exercise
  const fileIcon = resolveFileIcon(
    "src/sum.test.ts",
    {
      iconDefinitions: {
        _default: { fontCharacter: "\\E001" },
        _test: { fontCharacter: "\\E002", fontColor: "#519aba" },
        _typescript: { fontCharacter: "\\E003", fontColor: "#519aba" },
      },
      file: "_default",
      fileNames: {},
      fileExtensions: { "test.ts": "_test", ts: "_typescript" },
      languageIds: {},
      light: {},
    },
    { fileNames: {}, fileExtensions: {} },
  );

  // Verify
  expect(fileIcon.glyph).toEqual({ character: "", color: "#519aba" });
});

it("picks the icon for the file's language when nothing else matches", () => {
  // Exercise
  const fileIcon = resolveFileIcon(
    "src/Sum.TS",
    {
      iconDefinitions: {
        _default: { fontCharacter: "\\E001" },
        _typescript: { fontCharacter: "\\E003", fontColor: "#519aba" },
      },
      file: "_default",
      fileNames: {},
      fileExtensions: {},
      languageIds: { typescript: "_typescript" },
      light: {},
    },
    { fileNames: {}, fileExtensions: { ts: "typescript" } },
  );

  // Verify
  expect(fileIcon.glyph).toEqual({ character: "", color: "#519aba" });
});

it("uses the light icon that replaces the matched one", () => {
  // Exercise
  const fileIcon = resolveFileIcon(
    ".github/workflows/ci.yml",
    {
      iconDefinitions: {
        _default: { fontCharacter: "\\E001" },
        _yml: { fontCharacter: "\\E004", fontColor: "#a074c4" },
        _yml_light: { fontCharacter: "\\E004", fontColor: "#9068b0" },
      },
      file: "_default",
      fileNames: {},
      fileExtensions: {},
      languageIds: { yaml: "_yml" },
      light: { languageIds: { yaml: "_yml_light" } },
    },
    { fileNames: {}, fileExtensions: { yml: "yaml" } },
  );

  // Verify
  expect(fileIcon.lightGlyph).toEqual({
    character: "",
    color: "#9068b0",
  });
});

it("falls back to the generic file icon", () => {
  // Exercise
  const fileIcon = resolveFileIcon(
    "pr-7.step-review",
    {
      iconDefinitions: {
        _default: { fontCharacter: "\\E001" },
        _default_light: { fontCharacter: "\\E001", fontColor: "#bbbbbb" },
      },
      file: "_default",
      fileNames: {},
      fileExtensions: {},
      languageIds: {},
      light: { file: "_default_light" },
    },
    { fileNames: {}, fileExtensions: {} },
  );

  // Verify
  expect(fileIcon).toEqual({
    glyph: { character: "", color: null },
    lightGlyph: { character: "", color: "#bbbbbb" },
  });
});
