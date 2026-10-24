export default interface ShareSessionOptions {
  /** The origin serving the share API, e.g. the app's. */
  apiOrigin: string;
  shareId: string;
  shareKey: CryptoKey;
  participantId: string;
  participantSecret: string;
}
