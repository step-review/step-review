import type FileIconGlyph from "./FileIconGlyph.ts";
import type FileIconTheme from "./FileIconTheme.ts";
import type LanguageAssociations from "./LanguageAssociations.ts";

type IconCategory = "fileNames" | "fileExtensions" | "languageIds";

/**
 * Picks the icon of a file the way VS Code does: by file name, then by
 * extension (longest first, `test.ts` before `ts`), then by language.
 */
export default function resolveFileIcon(
  path: string,
  fileIconTheme: FileIconTheme,
  languageAssociations: LanguageAssociations,
): { glyph: FileIconGlyph; lightGlyph: FileIconGlyph } {
  const fileName = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  const extensions = fileName
    .split(".")
    .slice(1)
    .map((_, index, parts) => parts.slice(index).join("."));
  const languageId =
    languageAssociations.fileNames[fileName] ??
    extensions
      .map((extension) => languageAssociations.fileExtensions[extension])
      .find((id) => id !== undefined);
  const candidates: [IconCategory, string][] = [
    ["fileNames", fileName],
    ...extensions.map((extension): [IconCategory, string] => [
      "fileExtensions",
      extension,
    ]),
    ...(languageId
      ? [["languageIds", languageId] as [IconCategory, string]]
      : []),
  ];
  const match = candidates.find(
    ([category, key]) => fileIconTheme[category][key] !== undefined,
  );
  if (!match) {
    return {
      glyph: toGlyph(fileIconTheme, fileIconTheme.file),
      lightGlyph: toGlyph(
        fileIconTheme,
        fileIconTheme.light.file ?? fileIconTheme.file,
      ),
    };
  }
  const [category, key] = match;
  const iconName = fileIconTheme[category][key]!;
  return {
    glyph: toGlyph(fileIconTheme, iconName),
    lightGlyph: toGlyph(
      fileIconTheme,
      fileIconTheme.light[category]?.[key] ?? iconName,
    ),
  };
}

function toGlyph(
  fileIconTheme: FileIconTheme,
  iconName: string,
): FileIconGlyph {
  // Themes name only icons they define.
  const iconDefinition = fileIconTheme.iconDefinitions[iconName]!;
  return {
    // Written as a CSS escape, e.g. `\E001`.
    character: String.fromCodePoint(
      Number.parseInt(iconDefinition.fontCharacter.slice(1), 16),
    ),
    color: iconDefinition.fontColor ?? null,
  };
}
