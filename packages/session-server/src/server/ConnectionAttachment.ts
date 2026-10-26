/** What a session's socket remembers across hibernation. */
export default interface ConnectionAttachment {
  connectionId: string;
  /** `null` until the connection joins. */
  participantId: string | null;
  /** The encrypted presence; `null` until the participant sets one. */
  presence: string | null;
}
