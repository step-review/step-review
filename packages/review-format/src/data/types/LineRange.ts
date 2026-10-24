import type * as v from "valibot";
import type lineRangeSchema from "../schemas/lineRangeSchema.ts";

type LineRange = v.InferOutput<typeof lineRangeSchema>;

export default LineRange;
