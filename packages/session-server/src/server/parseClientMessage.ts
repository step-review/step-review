import * as v from "valibot";
import type ClientMessage from "../protocol/ClientMessage.ts";
import clientMessageSchema from "../protocol/clientMessageSchema.ts";

/** `null` when the message isn't valid. */
export default function parseClientMessage(
  message: string | ArrayBuffer,
): ClientMessage | null {
  if (typeof message !== "string") {
    return null;
  }
  try {
    const result = v.safeParse(clientMessageSchema, JSON.parse(message));
    return result.success ? result.output : null;
  } catch {
    return null;
  }
}
