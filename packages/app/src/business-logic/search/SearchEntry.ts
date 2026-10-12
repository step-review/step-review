export default interface SearchEntry {
  id: string;
  kind: "step" | "file" | "note";
  label: string;
  description: string;
  stepId: string;
  /** Element to scroll to in the step, if any. */
  fragment: string | null;
}
