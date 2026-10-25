/** Where a participant is in the review, as their presence tells. */
export default interface PresenceLocation {
  /** `null` on the overview. */
  stepId: string | null;
  /** The file at the top of the viewport; `null` when there is none. */
  fileId: string | null;
}
