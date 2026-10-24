import type ParticipantRecord from "./ParticipantRecord.ts";

/**
 * Rows are at most 2 MB in a Durable Object's database, so reviews are stored
 * in chunks.
 */
const reviewChunkBytes = 1024 * 1024;

/**
 * The stored data of a share: its owner, the latest version of its encrypted
 * review, and its participants' encrypted states. Tables are only created when
 * the share is, so that looking up an unknown share stores nothing.
 */
export default class ShareStorage {
  private storage: DurableObjectStorage;

  constructor(storage: DurableObjectStorage) {
    this.storage = storage;
  }

  exists(): boolean {
    return (
      this.storage.sql
        .exec(
          "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'share'",
        )
        .toArray().length > 0
    );
  }

  /** `null` when the share doesn't exist. */
  readShare(): { ownerSecretHash: string; versionId: string } | null {
    if (!this.exists()) {
      return null;
    }
    const [row] = this.storage.sql
      .exec<{ owner_secret_hash: string; version_id: string }>(
        "SELECT owner_secret_hash, version_id FROM share",
      )
      .toArray();
    return row
      ? { ownerSecretHash: row.owner_secret_hash, versionId: row.version_id }
      : null;
  }

  /** Replaces the review with a new version, creating the share if needed. */
  writeReview(
    ownerSecretHash: string,
    versionId: string,
    review: ArrayBuffer,
  ): void {
    this.storage.transactionSync(() => {
      this.storage.sql.exec(
        `CREATE TABLE IF NOT EXISTS share (
          singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
          owner_secret_hash TEXT NOT NULL,
          version_id TEXT NOT NULL
        )`,
      );
      this.storage.sql.exec(
        `CREATE TABLE IF NOT EXISTS review_chunks (
          chunk_index INTEGER PRIMARY KEY,
          data BLOB NOT NULL
        )`,
      );
      this.storage.sql.exec(
        `CREATE TABLE IF NOT EXISTS participants (
          participant_id TEXT PRIMARY KEY,
          secret_hash TEXT NOT NULL,
          revision INTEGER NOT NULL,
          state TEXT
        )`,
      );
      this.storage.sql.exec(
        `INSERT INTO share (singleton, owner_secret_hash, version_id)
        VALUES (1, ?, ?)
        ON CONFLICT (singleton) DO UPDATE SET version_id = excluded.version_id`,
        ownerSecretHash,
        versionId,
      );
      this.storage.sql.exec("DELETE FROM review_chunks");
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
}
