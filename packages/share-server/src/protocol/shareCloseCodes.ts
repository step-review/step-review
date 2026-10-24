/** Why the server closed a share's socket. */
export default {
  invalidMessage: 4400,
  /** The participant secret doesn't match the participant's. */
  forbidden: 4403,
  /** The share doesn't exist, or was deleted or expired. */
  shareNotFound: 4404,
  tooManyParticipants: 4429,
} as const;
