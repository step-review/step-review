import type * as v from "valibot";
import type reviewStateSchema from "./reviewStateSchema.ts";

/** What the reviewer did on a review: the files they viewed. */
type ReviewState = v.InferOutput<typeof reviewStateSchema>;

export default ReviewState;
