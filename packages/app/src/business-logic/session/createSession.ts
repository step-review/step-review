import { sessionApiPaths } from "@step-review/session-server";
import encryptReviewFile from "./encryptReviewFile.ts";
import SessionApiError from "./SessionApiError.ts";
import type SessionReviewFile from "./SessionReviewFile.ts";

/**
 * Creates a session on the server with its encrypted review, which never
 * changes, owned by whoever holds the owner secret.
 */
export default async function createSession(
  apiOrigin: string,
  session: { sessionId: string; sessionKey: CryptoKey; ownerSecret: string },
  sessionReviewFile: SessionReviewFile,
): Promise<void> {
  const response = await fetch(
    new URL(sessionApiPaths.review(session.sessionId), apiOrigin),
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${session.ownerSecret}` },
      body: await encryptReviewFile(
        session.sessionKey,
        session.sessionId,
        sessionReviewFile,
      ),
    },
  );
  if (!response.ok) {
    throw new SessionApiError(response.status);
  }
}
