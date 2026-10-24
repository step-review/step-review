/**
 * A share opened in this browser: what is needed to open it again, never its
 * content, which the server holds.
 */
export default interface ShareBookmark {
  shareId: string;
  /** The key the share's links hold, which decrypts it. */
  shareKey: string;
  /** The review's title, for the start page; empty until it loads. */
  title: string;
  /** When the share was last opened, in milliseconds since the epoch. */
  openedAt: number;
  participantId: string;
  /** Proves to the server that the participant is this browser. */
  participantSecret: string;
  /** Set when this browser created the share, to update or delete it. */
  ownerSecret: string | null;
}
