import { inject } from "vitest";
import importShareKey from "../business-logic/share-crypto/importShareKey.ts";
import randomBase64Url from "../business-logic/share-crypto/randomBase64Url.ts";
import uploadReviewFile from "../business-logic/sharing/uploadReviewFile.ts";

/**
 * Creates a share on the test server, with a placeholder review: the session
 * tests don't read it.
 */
export default async function createTestShare(): Promise<{
  apiOrigin: string;
  shareId: string;
  shareKey: CryptoKey;
  ownerSecret: string;
}> {
  const apiOrigin = inject("shareServerOrigin");
  const shareId = randomBase64Url(16);
  const shareKey = (await importShareKey(randomBase64Url(32)))!;
  const ownerSecret = randomBase64Url(32);
  await uploadReviewFile(
    apiOrigin,
    { shareId, shareKey, ownerSecret },
    { fileName: "test.step-review", text: "" },
  );
  return { apiOrigin, shareId, shareKey, ownerSecret };
}
