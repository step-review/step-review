/** What each encrypted envelope of a share is bound to. */
export default {
  review: (shareId: string) => `step-review:review:${shareId}`,
  participantState: (shareId: string, participantId: string) =>
    `step-review:state:${shareId}:${participantId}`,
  presence: (shareId: string, participantId: string) =>
    `step-review:presence:${shareId}:${participantId}`,
};
