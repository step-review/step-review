import type * as v from "valibot";
import type stepFileSchema from "../schemas/stepFileSchema.ts";

type StepFile = v.InferOutput<typeof stepFileSchema>;

export default StepFile;
