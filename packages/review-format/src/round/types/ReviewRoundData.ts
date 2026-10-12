import type * as v from "valibot";
import type reviewRoundDataSchema from "../schemas/reviewRoundDataSchema.ts";

type ReviewRoundData = v.InferOutput<typeof reviewRoundDataSchema>;

export default ReviewRoundData;
