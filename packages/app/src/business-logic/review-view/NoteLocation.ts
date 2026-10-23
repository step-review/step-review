import type { Note } from "@step-review/review-format";

export default interface NoteLocation {
  note: Note;
  stepId: string;
  /** `null` for step notes. */
  path: string | null;
}
