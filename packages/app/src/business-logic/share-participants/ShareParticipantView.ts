/** A participant of a shared review, as shown to the others. */
export default interface ShareParticipantView {
  participantId: string;
  /** Empty when the participant didn't give one. */
  name: string;
  /** Picks the participant's color among the avatar colors. */
  colorIndex: number;
  isSelf: boolean;
  isOnline: boolean;
  /**
   * The steps the participant is on, in one or more tabs: `null` for the
   * overview. Empty for the own participant, who is wherever the page is.
   */
  stepIds: (string | null)[];
  viewedFingerprints: Set<string>;
}
