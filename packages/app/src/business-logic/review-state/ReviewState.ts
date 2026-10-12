import type * as v from "valibot";
import type reviewStateSchema from "./reviewStateSchema.ts";

/** What the reviewer did on a review: viewed files and feedback. */
type ReviewState = v.InferOutput<typeof reviewStateSchema>;

export default ReviewState;
