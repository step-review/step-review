import type * as v from "valibot";
import type viewedMarkSchema from "./viewedMarkSchema.ts";

type ViewedMark = v.InferOutput<typeof viewedMarkSchema>;

export default ViewedMark;
