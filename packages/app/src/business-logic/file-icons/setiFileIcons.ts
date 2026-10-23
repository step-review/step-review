import setiIconTheme from "../../../vendor/seti/setiIconTheme.json";
import vscodeLanguages from "../../../vendor/seti/vscodeLanguages.json";
import type FileIconTheme from "./FileIconTheme.ts";
import type LanguageAssociations from "./LanguageAssociations.ts";

/** VS Code's Seti file icon theme, and the language associations it uses. */
const setiFileIcons: {
  fileIconTheme: FileIconTheme;
  languageAssociations: LanguageAssociations;
} = { fileIconTheme: setiIconTheme, languageAssociations: vscodeLanguages };

export default setiFileIcons;
