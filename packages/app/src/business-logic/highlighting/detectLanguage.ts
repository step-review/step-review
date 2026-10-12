import { bundledLanguagesInfo } from "shiki";

const languagesByFileName: Record<string, string> = {
  Dockerfile: "docker",
  Makefile: "make",
  Gemfile: "ruby",
  Rakefile: "ruby",
};

const languagesByExtension = new Map<string, string>();
for (const languageInfo of bundledLanguagesInfo) {
  for (const name of [languageInfo.id, ...(languageInfo.aliases ?? [])]) {
    if (!languagesByExtension.has(name)) {
      languagesByExtension.set(name, languageInfo.id);
    }
  }
}
languagesByExtension.set("yml", "yaml");
languagesByExtension.set("mjs", "javascript");
languagesByExtension.set("cjs", "javascript");
languagesByExtension.set("htm", "html");

/** Shiki language for a file path, or `null` for plain text. */
export default function detectLanguage(path: string): string | null {
  const fileName = path.split("/").at(-1) ?? path;
  const byFileName = languagesByFileName[fileName];
  if (byFileName) {
    return byFileName;
  }
  const extension = /\.([^.]+)$/u.exec(fileName)?.[1]?.toLowerCase();
  return extension ? (languagesByExtension.get(extension) ?? null) : null;
}
