import type ParticipantRecord from "./ParticipantRecord.ts";

/**
 * Rows are at most 2 MB in a Durable Object's database, so reviews are stored
 * in chunks.
 */
const reviewChunkBytes = 1024 * 1024;

/**
 * The stored data of a session: its owner, its encrypted review, and its
 * participants' encrypted states, or, once it ended, only that it did. Tables
 * are only created when the session is, so that looking up an unknown session
 * stores nothing.
 */
export default class SessionStore {
  private storage: DurableObjectStorage;

  constructor(storage: DurableObjectStorage) {
    this.storage = storage;
  }

  exists(): boolean {
    return this.hasTable("session");
  }

  /**
   * Whether the session can be created: it doesn't exist, and never did. An
   * ended session isn't created again: its participants still hold its key, so
   * any of them could otherwise pass off a review as the owner's.
   */
  canCreate(): boolean {
    return !this.exists() && !this.hasTable("ended");
  }

  /**
   * Marks the session as ended, once its data is deleted: the table is the
   * mark.
   */
  markEnded(): void {
    this.storage.sql.exec(
      "CREATE TABLE IF NOT EXISTS ended (singleton INTEGER PRIMARY KEY)",
    );
  }

  /** `null` when the session doesn't exist. */
  readOwnerSecretHash(): string | null {
    if (!this.exists()) {
      return null;
    }
    const [row] = this.storage.sql
      .exec<{ owner_secret_hash: string }>(
        "SELECT owner_secret_hash FROM session",
      )
      .toArray();
    return row?.owner_secret_hash ?? null;
  }

  /** Creates the session with its review, which never changes. */
  create(ownerSecretHash: string, review: ArrayBuffer): void {
    this.storage.transactionSync(() => {
      this.storage.sql.exec(
        `CREATE TABLE session (
          singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
          owner_secret_hash TEXT NOT NULL
        )`,
      );
      this.storage.sql.exec(
        `CREATE TABLE review_chunks (
          chunk_index INTEGER PRIMARY KEY,
          data BLOB NOT NULL
        )`,
      );
      this.storage.sql.exec(
        `CREATE TABLE participants (
          participant_id TEXT PRIMARY KEY,
          secret_hash TEXT NOT NULL,
          revision INTEGER NOT NULL,
          state TEXT
        )`,
      );
      this.storage.sql.exec(
        "INSERT INTO session (singleton, owner_secret_hash) VALUES (1, ?)",
        ownerSecretHash,
      );
      for (
        let offset = 0, chunkIndex = 0;
        offset < review.byteLength;
        offset += reviewChunkBytes, chunkIndex++
      ) {
        this.storage.sql.exec(
          "INSERT INTO review_chunks (chunk_index, data) VALUES (?, ?)",
          chunkIndex,
          review.slice(offset, offset + reviewChunkBytes),
        );
      }
    });
  }

  readReview(): ArrayBuffer {
    const chunks = this.storage.sql
      .exec<{ data: ArrayBuffer }>(
        "SELECT data FROM review_chunks ORDER BY chunk_index",
      )
      .toArray()
      .map((row) => new Uint8Array(row.data));
    const review = new Uint8Array(
      chunks.reduce((length, chunk) => length + chunk.byteLength, 0),
    );
    let offset = 0;
    for (const chunk of chunks) {
      review.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return review.buffer;
  }

  readParticipant(participantId: string): ParticipantRecord | null {
    const [row] = this.storage.sql
      .exec<{ secret_hash: string; revision: number; state: string | null }>(
        "SELECT secret_hash, revision, state FROM participants WHERE participant_id = ?",
        participantId,
      )
      .toArray();
    return row
      ? {
          secretHash: row.secret_hash,
          revision: row.revision,
          state: row.state,
        }
      : null;
  }

  countParticipants(): number {
    return this.storage.sql
      .exec<{ count: number }>("SELECT count(*) AS count FROM participants")
      .one().count;
  }

  addParticipant(participantId: string, secretHash: string): void {
    this.storage.sql.exec(
      "INSERT INTO participants (participant_id, secret_hash, revision) VALUES (?, ?, 0)",
      participantId,
      secretHash,
    );
  }

  writeParticipantState(
    participantId: string,
    revision: number,
    state: string,
  ): void {
    this.storage.sql.exec(
      "UPDATE participants SET revision = ?, state = ? WHERE participant_id = ?",
      revision,
      state,
      participantId,
    );
  }

  /** The states written so far. */
  readParticipantStates(): {
    participantId: string;
    revision: number;
    state: string;
  }[] {
    return this.storage.sql
      .exec<{ participant_id: string; revision: number; state: string }>(
        "SELECT participant_id, revision, state FROM participants WHERE state IS NOT NULL",
      )
      .toArray()
      .map((row) => ({
        participantId: row.participant_id,
        revision: row.revision,
        state: row.state,
      }));
  }

  private hasTable(name: string): boolean {
    return (
      this.storage.sql
        .exec(
          "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
          name,
        )
        .toArray().length > 0
    );
  }
}
