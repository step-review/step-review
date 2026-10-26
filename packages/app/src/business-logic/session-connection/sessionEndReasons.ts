import { sessionCloseCodes } from "@step-review/session-server";
import type SessionEndReason from "./SessionEndReason.ts";

/** The socket close codes after which reconnecting is pointless. */
export default new Map<number, SessionEndReason>([
  [sessionCloseCodes.invalidMessage, "failed"],
  [sessionCloseCodes.forbidden, "forbidden"],
  [sessionCloseCodes.sessionNotFound, "notFound"],
  [sessionCloseCodes.tooManyParticipants, "tooManyParticipants"],
]);
