export default interface SessionConnectionOptions {
  /** The origin serving the session API, e.g. the app's. */
  apiOrigin: string;
  sessionId: string;
  sessionKey: CryptoKey;
  participantId: string;
  participantSecret: string;
}
