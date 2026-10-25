/** Why a session can't be joined, or not anymore. */
type SessionEndReason =
  /** Deleted by its owner, or expired. */
  | "notFound"
  /** The participant secret doesn't match, e.g. after a data restore. */
  | "forbidden"
  | "tooManyParticipants"
  /** The server refused a message: retrying would fail the same way. */
  | "failed";

export default SessionEndReason;
