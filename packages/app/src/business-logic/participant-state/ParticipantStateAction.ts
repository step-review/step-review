import type ReviewStateAction from "../review-state/ReviewStateAction.ts";

type ParticipantStateAction =
  | ReviewStateAction
  | { type: "rename"; name: string };

export default ParticipantStateAction;
