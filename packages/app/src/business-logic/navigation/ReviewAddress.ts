/** Where a review is: kept in this browser (or the example), or in a session. */
type ReviewAddress =
  | { kind: "local"; reviewId: string }
  | {
      kind: "session";
      sessionId: string;
      /** The key that decrypts the session; `null` when the URL lacks it. */
      sessionKey: string | null;
    };

export default ReviewAddress;
