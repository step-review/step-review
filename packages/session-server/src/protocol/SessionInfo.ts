import type * as v from "valibot";
import type sessionInfoSchema from "./sessionInfoSchema.ts";

type SessionInfo = v.InferOutput<typeof sessionInfoSchema>;

export default SessionInfo;
