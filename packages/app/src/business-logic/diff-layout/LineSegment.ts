export default interface LineSegment {
  text: string;
  color: string | null;
  darkColor: string | null;
  /** Part of the words that changed in the line. */
  changed: boolean;
}
