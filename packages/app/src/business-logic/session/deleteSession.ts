import { sessionApiPaths } from "@step-review/session-server";
import SessionApiError from "./SessionApiError.ts";

/** Deletes a session from the server, as its owner. */
export default async function deleteSession(
  apiOrigin: string,
  sessionId: string,
  ownerSecret: string,
): Promise<void> {
  const response = await fetch(
    new URL(sessionApiPaths.session(sessionId), apiOrigin),
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${ownerSecret}` },
    },
  );
  // Already gone (e.g. expired) is as good as deleted.
  if (!response.ok && response.status !== 404) {
    throw new SessionApiError(response.status);
  }
}
