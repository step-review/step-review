import { shareApiPaths } from "@step-review/share-server";
import ShareApiError from "./ShareApiError.ts";

/** Deletes a share from the server, as its owner. */
export default async function deleteShare(
  apiOrigin: string,
  shareId: string,
  ownerSecret: string,
): Promise<void> {
  const response = await fetch(
    new URL(shareApiPaths.share(shareId), apiOrigin),
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${ownerSecret}` },
    },
  );
  // Already gone (e.g. expired) is as good as deleted.
  if (!response.ok && response.status !== 404) {
    throw new ShareApiError(response.status);
  }
}
