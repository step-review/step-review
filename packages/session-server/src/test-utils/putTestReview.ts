import sessionApiPaths from "../protocol/sessionApiPaths.ts";
import sessionServerFetch from "./sessionServerFetch.ts";

/** Uploads a review to a session, as its owner. */
export default function putTestReview(
  sessionId: string,
  ownerSecret: string,
  review: Uint8Array<ArrayBuffer>,
): Promise<Response> {
  return sessionServerFetch(sessionApiPaths.review(sessionId), {
    method: "PUT",
    headers: { Authorization: `Bearer ${ownerSecret}` },
    body: review,
  });
}
