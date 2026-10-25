import {
  sessionApiPaths,
  sessionInfoSchema,
  type SessionInfo,
} from "@step-review/session-server";
import * as v from "valibot";
import SessionApiError from "./SessionApiError.ts";

/** `null` when the session doesn't exist, or was deleted or expired. */
export default async function fetchSessionInfo(
  apiOrigin: string,
  sessionId: string,
): Promise<SessionInfo | null> {
  const response = await fetch(
    new URL(sessionApiPaths.session(sessionId), apiOrigin),
  );
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new SessionApiError(response.status);
  }
  return v.parse(sessionInfoSchema, await response.json());
}
