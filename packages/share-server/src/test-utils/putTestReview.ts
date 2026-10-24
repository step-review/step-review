import shareApiPaths from "../protocol/shareApiPaths.ts";
import shareServerFetch from "./shareServerFetch.ts";

/** Uploads a review to a share, as its owner. */
export default function putTestReview(
  shareId: string,
  ownerSecret: string,
  review: Uint8Array<ArrayBuffer>,
): Promise<Response> {
  return shareServerFetch(shareApiPaths.review(shareId), {
    method: "PUT",
    headers: { Authorization: `Bearer ${ownerSecret}` },
    body: review,
  });
}
