/** What each encrypted envelope of a session is bound to. */
export default {
  review: (sessionId: string) => `step-review:review:${sessionId}`,
  participantState: (sessionId: string, participantId: string) =>
    `step-review:state:${sessionId}:${participantId}`,
  presence: (sessionId: string, participantId: string) =>
    `step-review:presence:${sessionId}:${participantId}`,
};
