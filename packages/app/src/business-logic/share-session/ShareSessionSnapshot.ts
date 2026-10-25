import type FileViewedStatus from "../participant-state/FileViewedStatus.ts";
import type ParticipantState from "../participant-state/ParticipantState.ts";
import type Presence from "../participant-state/Presence.ts";
import type ShareEndReason from "./ShareEndReason.ts";

/** What a share session knows, for rendering. */
export default interface ShareSessionSnapshot {
  connectionStatus: "connecting" | "connected" | "ended";
  /** Set once the status is `ended`. */
  endReason: ShareEndReason | null;
  /** The version of the review to show; `null` until the server tells. */
  versionId: string | null;
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
