import type ReviewAddress from "./ReviewAddress.ts";

/**
 * Identifies the review an address names, e.g. as a React key. The session's
 * key isn't part of it: it doesn't change which review it is.
 */
export default function reviewAddressId(reviewAddress: ReviewAddress): string {
  return reviewAddress.kind === "local"
    ? `local:${reviewAddress.reviewId}`
    : `session:${reviewAddress.sessionId}`;
}
