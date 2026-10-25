import type FileViewedStatus from "../participant-state/FileViewedStatus.ts";
import type ParticipantState from "../participant-state/ParticipantState.ts";
import type Presence from "../participant-state/Presence.ts";
import type SessionEndReason from "./SessionEndReason.ts";

/** What a session connection knows, for rendering. */
export default interface SessionConnectionSnapshot {
  connectionStatus: "connecting" | "connected" | "ended";
  /** Set once the status is `ended`. */
  endReason: SessionEndReason | null;
  ownState: ParticipantState;
  /** Whether some changes to the own state aren't stored yet. */
  hasPendingChanges: boolean;
  /**
   * Whether the participant joined for the first time: they have no state yet,
   * not even a name.
   */
  isNewParticipant: boolean;
  /** The other participants' states, by participant ID. */
  otherParticipantStates: Map<string, ParticipantState>;
  /**
   * The viewed status of the files any participant marked, by fingerprint: the
   * review's state, shared by every participant.
   */
  fileViewedStatuses: Map<string, FileViewedStatus>;
  /** The other connections' presences, by connection ID. */
  otherPresences: Map<string, { participantId: string; presence: Presence }>;
}
