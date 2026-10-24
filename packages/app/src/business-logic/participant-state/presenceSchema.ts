import * as v from "valibot";

/**
 * Where a participant is: the hash of the step's ID, `null` on the overview.
 * Hashed because step IDs have no length limit, and presences do.
 */
export default v.object({
  stepIdHash: v.nullable(v.pipe(v.string(), v.maxLength(32))),
});
