type FileIconMap = Record<string, string | undefined>;

/** The parts of a VS Code icon theme that pick a file's icon. */
export default interface FileIconManifest {
  /** Icon of files that nothing else matches. */
  file: string;
  /** Icons by lowercase file name, e.g. `package.json`. */
  fileNames: FileIconMap;
  /** Icons by lowercase extension without the dot, e.g. `test.ts` or `ts`. */
  fileExtensions: FileIconMap;
  /** Icons that replace the ones above in light color schemes. */
  light: { fileNames?: FileIconMap; fileExtensions?: FileIconMap };
}
