import { shareApiPaths } from "@step-review/share-server";
import ShareApiError from "./ShareApiError.ts";

/**
 * The encrypted review of a version. Versions never change, so the browser
 * caches them.
 */
export default async function fetchReviewVersion(
  apiOrigin: string,
  shareId: string,
  versionId: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const response = await fetch(
    new URL(shareApiPaths.reviewVersion(shareId, versionId), apiOrigin),
  );
  if (!response.ok) {
    throw new ShareApiError(response.status);
  }
  return new Uint8Array(await response.arrayBuffer());
}
