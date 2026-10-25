import type * as v from "valibot";
import type clientMessageSchema from "./clientMessageSchema.ts";

type ClientMessage = v.InferOutput<typeof clientMessageSchema>;

export default ClientMessage;
