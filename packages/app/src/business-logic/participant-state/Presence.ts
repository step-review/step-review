import type * as v from "valibot";
import type presenceSchema from "./presenceSchema.ts";

type Presence = v.InferOutput<typeof presenceSchema>;

export default Presence;
