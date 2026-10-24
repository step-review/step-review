import type * as v from "valibot";
import type shareInfoSchema from "./shareInfoSchema.ts";

type ShareInfo = v.InferOutput<typeof shareInfoSchema>;

export default ShareInfo;
