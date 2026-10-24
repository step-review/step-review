import * as v from "valibot";
import idSchema from "./idSchema.ts";
import secretSchema from "./secretSchema.ts";
import shareLimits from "./shareLimits.ts";

/**
 * What a browser sends on a share's socket. `join` comes first; states and
 * presences are encrypted, so the server only stores and relays them.
 */
export default v.variant("type", [
  v.object({
    type: v.literal("join"),
    participantId: idSchema,
    participantSecret: secretSchema,
  }),
  v.object({
    type: v.literal("writeState"),
    /** The revision the state was derived from; the write fails otherwise. */
    revision: v.pipe(v.number(), v.safeInteger(), v.minValue(0)),
    state: v.pipe(v.string(), v.maxLength(shareLimits.maxStateLength)),
  }),
  v.object({
    type: v.literal("setPresence"),
    presence: v.pipe(v.string(), v.maxLength(shareLimits.maxPresenceLength)),
  }),
]);
