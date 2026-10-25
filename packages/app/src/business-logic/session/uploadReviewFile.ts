import {
  sessionApiPaths,
  sessionInfoSchema,
  type SessionInfo,
} from "@step-review/session-server";
import * as v from "valibot";
import encryptReviewFile from "./encryptReviewFile.ts";
import SessionApiError from "./SessionApiError.ts";
import type SessionReviewFile from "./SessionReviewFile.ts";

/**
 * Encrypts and uploads a review file, as a session's new version. The first
 * upload creates the session, owned by whoever holds the owner secret.
 */
export default async function uploadReviewFile(
  apiOrigin: string,
  session: { sessionId: string; sessionKey: CryptoKey; ownerSecret: string },
  sessionReviewFile: SessionReviewFile,
): Promise<SessionInfo> {
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
  return v.parse(sessionInfoSchema, await response.json());
}
