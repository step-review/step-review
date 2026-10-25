import { sessionApiPaths } from "@step-review/session-server";
import SessionApiError from "./SessionApiError.ts";

/** Whether the session exists: `false` once it was deleted, or expired. */
export default async function fetchSessionExists(
  apiOrigin: string,
  sessionId: string,
): Promise<boolean> {
  const response = await fetch(
    new URL(sessionApiPaths.session(sessionId), apiOrigin),
  );
  if (response.status === 404) {
    return false;
  }
  if (!response.ok) {
    throw new SessionApiError(response.status);
  }
  return true;
}
