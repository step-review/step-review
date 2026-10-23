import type * as v from "valibot";
import type reviewTargetSchema from "../schemas/reviewTargetSchema.ts";

type ReviewTarget = v.InferOutput<typeof reviewTargetSchema>;

export default ReviewTarget;
