import type * as v from "valibot";
import type lineAnchorSchema from "../schemas/lineAnchorSchema.ts";

type LineAnchor = v.InferOutput<typeof lineAnchorSchema>;

export default LineAnchor;
