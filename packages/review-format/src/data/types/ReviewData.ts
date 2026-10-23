import type * as v from "valibot";
import type reviewDataSchema from "../schemas/reviewDataSchema.ts";

type ReviewData = v.InferOutput<typeof reviewDataSchema>;

export default ReviewData;
