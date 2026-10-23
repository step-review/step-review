import type FileIconManifest from "./FileIconManifest.ts";

/**
 * Picks the icon of a file the way VS Code does: by file name first, then by
 * extension, longest first (`test.ts` before `ts`).
 */
export default function resolveFileIcon(
  path: string,
  fileIconManifest: FileIconManifest,
): { iconName: string; lightIconName: string } {
  const fileName = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  const { light } = fileIconManifest;
  const fileNameIcon = fileIconManifest.fileNames[fileName];
  if (fileNameIcon) {
    return {
      iconName: fileNameIcon,
      lightIconName: light.fileNames?.[fileName] ?? fileNameIcon,
    };
  }
  let extension = fileName;
  let dotIndex = extension.indexOf(".");
  while (dotIndex !== -1) {
    extension = extension.slice(dotIndex + 1);
    const extensionIcon = fileIconManifest.fileExtensions[extension];
    if (extensionIcon) {
      return {
        iconName: extensionIcon,
        lightIconName: light.fileExtensions?.[extension] ?? extensionIcon,
      };
    }
    dotIndex = extension.indexOf(".");
  }
  return {
    iconName: fileIconManifest.file,
    lightIconName: fileIconManifest.file,
  };
}
