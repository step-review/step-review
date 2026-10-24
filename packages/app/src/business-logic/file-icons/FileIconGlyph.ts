/** A file icon: a character of the icon font, in a color. */
export default interface FileIconGlyph {
  character: string;
  /** `null` to use the text color. */
  color: string | null;
}
