import { inject } from "vitest";
import importSessionKey from "../business-logic/session-crypto/importSessionKey.ts";
import randomBase64Url from "../business-logic/session-crypto/randomBase64Url.ts";
import uploadReviewFile from "../business-logic/session/uploadReviewFile.ts";

/**
 * Creates a session on the test server, with a placeholder review: the session
 * connection tests don't read it.
 */
export default async function createTestSession(): Promise<{
  apiOrigin: string;
  sessionId: string;
  sessionKey: CryptoKey;
  ownerSecret: string;
}> {
  const apiOrigin = inject("sessionServerOrigin");
  const sessionId = randomBase64Url(16);
  const sessionKey = (await importSessionKey(randomBase64Url(32)))!;
  const ownerSecret = randomBase64Url(32);
  await uploadReviewFile(
    apiOrigin,
    { sessionId, sessionKey, ownerSecret },
    { fileName: "test.step-review", text: "" },
  );
  return { apiOrigin, sessionId, sessionKey, ownerSecret };
}
