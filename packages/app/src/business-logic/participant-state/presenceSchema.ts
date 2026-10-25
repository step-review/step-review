import * as v from "valibot";

/**
 * Where a participant is: the hashes of the step's ID, `null` on the overview,
 * and of the ID of the file at the top of the viewport, `null` when there is
 * none. Hashed because IDs have no length limit, and presences do.
 */
export default v.object({
  stepIdHash: v.nullable(v.pipe(v.string(), v.maxLength(32))),
  fileIdHash: v.nullable(v.pipe(v.string(), v.maxLength(32))),
});
