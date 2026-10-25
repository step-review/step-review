import type * as v from "valibot";
import type serverMessageSchema from "./serverMessageSchema.ts";

type ServerMessage = v.InferOutput<typeof serverMessageSchema>;

export default ServerMessage;
