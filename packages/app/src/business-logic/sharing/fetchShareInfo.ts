import {
  shareApiPaths,
  shareInfoSchema,
  type ShareInfo,
} from "@step-review/share-server";
import * as v from "valibot";
import ShareApiError from "./ShareApiError.ts";

/** `null` when the share doesn't exist, or was deleted or expired. */
export default async function fetchShareInfo(
  apiOrigin: string,
  shareId: string,
): Promise<ShareInfo | null> {
  const response = await fetch(
    new URL(shareApiPaths.share(shareId), apiOrigin),
  );
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new ShareApiError(response.status);
  }
  return v.parse(shareInfoSchema, await response.json());
}
