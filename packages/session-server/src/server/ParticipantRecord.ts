export default interface ParticipantRecord {
  secretHash: string;
  /** Increases with every write of the state; 0 before the first one. */
  revision: number;
  /** The encrypted state; `null` before the first write. */
  state: string | null;
}
