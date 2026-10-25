import { sessionApiPaths } from "@step-review/session-server";
import SessionApiError from "./SessionApiError.ts";

/**
 * The encrypted review of a version. Versions never change, so the browser
 * caches them.
 */
export default async function fetchReviewVersion(
  apiOrigin: string,
  sessionId: string,
  versionId: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const response = await fetch(
    new URL(sessionApiPaths.reviewVersion(sessionId, versionId), apiOrigin),
  );
  if (!response.ok) {
    throw new SessionApiError(response.status);
  }
  return new Uint8Array(await response.arrayBuffer());
}
