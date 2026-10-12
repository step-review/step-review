import type * as v from "valibot";
import type stepSchema from "../schemas/stepSchema.ts";

type Step = v.InferOutput<typeof stepSchema>;

export default Step;
