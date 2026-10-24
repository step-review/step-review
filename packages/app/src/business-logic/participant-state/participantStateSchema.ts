import * as v from "valibot";
import reviewStateSchema from "../review-state/reviewStateSchema.ts";
import participantNameMaxLength from "./participantNameMaxLength.ts";

/** What a participant shares: their name, and the files they viewed. */
export default v.object({
  ...reviewStateSchema.entries,
  name: v.pipe(v.string(), v.maxLength(participantNameMaxLength)),
});
