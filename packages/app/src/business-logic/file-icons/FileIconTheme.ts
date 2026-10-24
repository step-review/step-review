type IconNames = Record<string, string | undefined>;

/** A VS Code font icon theme: its icons, and which files get them. */
export default interface FileIconTheme {
  iconDefinitions: Record<
    string,
    { fontCharacter: string; fontColor?: string } | undefined
  >;
  /** Icon of files that nothing else matches. */
  file: string;
  /** Icons by lowercase file name, e.g. `package.json`. */
  fileNames: IconNames;
  /** Icons by lowercase extension without the dot, e.g. `test.ts` or `ts`. */
  fileExtensions: IconNames;
  /** Icons by VS Code language ID, e.g. `typescript`. */
  languageIds: IconNames;
  /** Icons that replace the ones above in light color schemes. */
  light: {
    file?: string;
    fileNames?: IconNames;
    fileExtensions?: IconNames;
    languageIds?: IconNames;
  };
}
