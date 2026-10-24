type LanguageIds = Record<string, string | undefined>;

/** VS Code language IDs by lowercase file name and extension. */
export default interface LanguageAssociations {
  fileNames: LanguageIds;
  /** By extension without the dot, e.g. `ts`. */
  fileExtensions: LanguageIds;
}
