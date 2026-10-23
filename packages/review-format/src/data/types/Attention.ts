import type * as v from "valibot";
import type stepSchema from "../schemas/stepSchema.ts";

type Attention = v.InferOutput<typeof stepSchema>["attention"];

export default Attention;
