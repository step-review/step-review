/**
 * A session opened in this browser: what is needed to open it again, never its
 * content, which the server holds.
 */
export default interface SessionBookmark {
  sessionId: string;
  /** The key the session's links hold, which decrypts it. */
  sessionKey: string;
  /** The review's title, for the start page; empty until it loads. */
  title: string;
  /** When the session was last opened, in milliseconds since the epoch. */
  openedAt: number;
  participantId: string;
  /** Proves to the server that the participant is this browser. */
  participantSecret: string;
  /** Set when this browser created the session, to update or delete it. */
  ownerSecret: string | null;
}
