import sessionLimits from "../protocol/sessionLimits.ts";

/** The uploaded review; `null` when it is empty or too large. */
export default async function readReviewBody(
  request: Request,
): Promise<ArrayBuffer | null> {
  // Checked before reading, so that a large body isn't buffered.
  if (
    Number(request.headers.get("Content-Length")) > sessionLimits.maxReviewBytes
  ) {
    return null;
  }
  const review = await request.arrayBuffer();
  return review.byteLength > 0 &&
    review.byteLength <= sessionLimits.maxReviewBytes
    ? review
    : null;
}
