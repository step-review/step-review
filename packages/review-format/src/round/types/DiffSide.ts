import type * as v from "valibot";
import type diffSideSchema from "../schemas/diffSideSchema.ts";

type DiffSide = v.InferOutput<typeof diffSideSchema>;

export default DiffSide;
