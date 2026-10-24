import {
  shareApiPaths,
  shareInfoSchema,
  type ShareInfo,
} from "@step-review/share-server";
import * as v from "valibot";
import encryptReviewFile from "./encryptReviewFile.ts";
import ShareApiError from "./ShareApiError.ts";
import type SharedReviewFile from "./SharedReviewFile.ts";

/**
 * Encrypts and uploads a review file, as a share's new version. The first
 * upload creates the share, owned by whoever holds the owner secret.
 */
export default async function uploadReviewFile(
  apiOrigin: string,
  share: { shareId: string; shareKey: CryptoKey; ownerSecret: string },
  sharedReviewFile: SharedReviewFile,
): Promise<ShareInfo> {
  const response = await fetch(
    new URL(shareApiPaths.review(share.shareId), apiOrigin),
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${share.ownerSecret}` },
      body: await encryptReviewFile(
        share.shareKey,
        share.shareId,
        sharedReviewFile,
      ),
    },
  );
  if (!response.ok) {
    throw new ShareApiError(response.status);
  }
  return v.parse(shareInfoSchema, await response.json());
}
