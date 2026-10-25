import * as v from "valibot";
import participantNameMaxLength from "./participantNameMaxLength.ts";
import viewedMarkSchema from "./viewedMarkSchema.ts";

/**
 * What a participant shares: their name, and their latest mark of each file
 * they marked. Merged with the others' marks, they make the review's state.
 */
export default v.object({
  name: v.pipe(v.string(), v.maxLength(participantNameMaxLength)),
  viewedMarks: v.array(viewedMarkSchema),
});
