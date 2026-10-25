import * as v from "valibot";
import idSchema from "./idSchema.ts";

const revisionSchema = v.pipe(v.number(), v.safeInteger(), v.minValue(0));

const participantStateEntries = {
  participantId: idSchema,
  /** Increases with every write; 0 before the first one. */
  revision: revisionSchema,
  state: v.string(),
};

const presenceEntries = {
  connectionId: idSchema,
  participantId: idSchema,
  presence: v.string(),
};

/** What the server sends on a session's socket. */
export default v.variant("type", [
  v.object({
    type: v.literal("joined"),
    connectionId: idSchema,
    /** Every participant's state, the joining one's included. */
    participantStates: v.array(v.object(participantStateEntries)),
    /** The presences of the other connections. */
    presences: v.array(v.object(presenceEntries)),
  }),
  v.object({ type: v.literal("stateWritten"), revision: revisionSchema }),
  /** The write was based on an older revision: here is the current one. */
  v.object({
    type: v.literal("stateRejected"),
    revision: revisionSchema,
    state: v.nullable(v.string()),
  }),
  v.object({ type: v.literal("participantState"), ...participantStateEntries }),
  v.object({ type: v.literal("presence"), ...presenceEntries }),
  v.object({ type: v.literal("presenceEnded"), connectionId: idSchema }),
]);
