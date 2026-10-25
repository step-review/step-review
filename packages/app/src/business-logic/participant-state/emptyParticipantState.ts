import type ParticipantState from "./ParticipantState.ts";

export default function emptyParticipantState(): ParticipantState {
  return { name: "", viewedMarks: [] };
}
