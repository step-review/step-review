import {
  serverMessageSchema,
  type ServerMessage,
} from "@step-review/share-server";
import * as v from "valibot";

/** `null` when the message isn't valid. */
export default function parseServerMessage(data: string): ServerMessage | null {
  try {
    const result = v.safeParse(serverMessageSchema, JSON.parse(data));
    return result.success ? result.output : null;
  } catch {
    return null;
  }
}
