import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { Plugin } from "vite";
import fileIconsPath from "../src/business-logic/file-icons/fileIconsPath.ts";

interface MaterialIconManifest {
  iconDefinitions: Record<string, { iconPath: string }>;
  file: string;
  fileNames: Record<string, string>;
  fileExtensions: Record<string, string>;
  light: {
    fileNames?: Record<string, string>;
    fileExtensions?: Record<string, string>;
  };
}

/**
 * Publishes the file icons of the Material Icon Theme next to the app: emitted
 * on build, with the theme's MIT license, and served by the dev server. Only
 * file icons are published, not the folder ones.
 */
export default function emitFileIcons(): Plugin {
  const manifestPath = createRequire(import.meta.url).resolve(
    "material-icon-theme/dist/material-icons.json",
  );
  const manifest = JSON.parse(
    readFileSync(manifestPath, "utf8"),
  ) as MaterialIconManifest;
  const iconNames = new Set([
    manifest.file,
    ...Object.values(manifest.fileNames),
    ...Object.values(manifest.fileExtensions),
    ...Object.values(manifest.light.fileNames ?? {}),
    ...Object.values(manifest.light.fileExtensions ?? {}),
  ]);
  const readIcon = (iconName: string) =>
    readFileSync(
      join(dirname(manifestPath), manifest.iconDefinitions[iconName]!.iconPath),
    );
  return {
    name: "step-review:emit-file-icons",
    configureServer(server) {
      server.middlewares.use(fileIconsPath, (request, response, next) => {
        const iconName = /^\/([\w.-]+)\.svg$/u.exec(request.url ?? "")?.[1];
        if (!iconName || !iconNames.has(iconName)) {
          next();
          return;
        }
        response.setHeader("Content-Type", "image/svg+xml");
        response.end(readIcon(iconName));
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: `${fileIconsPath.slice(1)}/LICENSE`,
        source: readFileSync(join(dirname(manifestPath), "../LICENSE")),
      });
      for (const iconName of iconNames) {
        this.emitFile({
          type: "asset",
          fileName: `${fileIconsPath.slice(1)}/${iconName}.svg`,
          source: readIcon(iconName),
        });
      }
    },
  };
}
