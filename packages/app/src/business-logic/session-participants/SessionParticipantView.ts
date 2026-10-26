import type PresenceLocation from "../session-connection/PresenceLocation.ts";

/** A participant of a session, as shown to the others. */
export default interface SessionParticipantView {
  participantId: string;
  /** Empty when the participant didn't give one. */
  name: string;
  /** Picks the participant's color among the avatar colors. */
  colorIndex: number;
  isSelf: boolean;
  isOnline: boolean;
  /**
   * Where the participant is, in one or more tabs. Empty for the own
   * participant, who is wherever the page is.
   */
  locations: PresenceLocation[];
  /** The files they marked viewed since the files were last marked not viewed. */
  viewedFingerprints: Set<string>;
}
