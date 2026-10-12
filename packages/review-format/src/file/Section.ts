import type SectionKind from "./SectionKind.ts";

export default interface Section {
  kind: SectionKind;
  /** 1-based line number of the marker line in the review file. */
  markerLineNumber: number;
  content: string;
}
