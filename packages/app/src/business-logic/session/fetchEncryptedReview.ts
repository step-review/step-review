import { sessionApiPaths } from "@step-review/session-server";
import SessionApiError from "./SessionApiError.ts";

/**
 * The encrypted review of a session. It never changes, so the browser caches
 * it.
 */
export default async function fetchEncryptedReview(
  apiOrigin: string,
  sessionId: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const response = await fetch(
    new URL(sessionApiPaths.review(sessionId), apiOrigin),
  );
  if (!response.ok) {
    throw new SessionApiError(response.status);
  }
  return new Uint8Array(await response.arrayBuffer());
}
