/** What a share accepts, so that it can't be used as free storage. */
export default {
  /** The largest encrypted review, in bytes. */
  maxReviewBytes: 8 * 1024 * 1024,
  /** The longest encrypted participant state, in characters. */
  maxStateLength: 256 * 1024,
  /**
   * The longest encrypted presence, in characters. It is kept with the
   * connection, whose attachment is limited to 2 KiB.
   */
  maxPresenceLength: 1024,
  maxParticipants: 50,
  /** How long a share is kept without activity, in milliseconds. */
  inactivityLifetime: 30 * 24 * 60 * 60 * 1000,
} as const;
