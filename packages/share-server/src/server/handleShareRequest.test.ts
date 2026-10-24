import { expect, it } from "vitest";
import shareApiPaths from "../protocol/shareApiPaths.ts";
import type ShareInfo from "../protocol/ShareInfo.ts";
import shareLimits from "../protocol/shareLimits.ts";
import putTestReview from "../test-utils/putTestReview.ts";
import randomTestId from "../test-utils/randomTestId.ts";
import shareServerFetch from "../test-utils/shareServerFetch.ts";

it("returns the version to load after a share is created", async () => {
  // Setup SUT
  const shareId = randomTestId();
  const response = await putTestReview(
    shareId,
    randomTestId(32),
    new Uint8Array([1, 2, 3]),
  );
  const { versionId } = (await response.json()) as ShareInfo;

  // Exercise
  const shareResponse = await shareServerFetch(shareApiPaths.share(shareId));

  // Verify
  expect(await shareResponse.json()).toEqual({ versionId });
});

it("returns the uploaded review, larger than a storage row, by its version", async () => {
  // Setup SUT
  const shareId = randomTestId();
  const review = new Uint8Array(2_500_000).map((_, index) => index % 251);
  const response = await putTestReview(shareId, randomTestId(32), review);
  const { versionId } = (await response.json()) as ShareInfo;

  // Exercise
  const versionResponse = await shareServerFetch(
    shareApiPaths.reviewVersion(shareId, versionId),
  );

  // Verify
  // Compared as buffers: deep equality is slow on millions of elements.
  const receivedReview = Buffer.from(await versionResponse.arrayBuffer());
  expect(receivedReview.equals(review)).toBe(true);
  expect(versionResponse.headers.get("Cache-Control")).toContain("immutable");
});

it("replaces the review, and its version, when the owner uploads it again", async () => {
  // Setup SUT
  const shareId = randomTestId();
  const ownerSecret = randomTestId(32);
  const firstResponse = await putTestReview(
    shareId,
    ownerSecret,
    new Uint8Array([1]),
  );
  const firstShareInfo = (await firstResponse.json()) as ShareInfo;

  // Exercise
  const secondResponse = await putTestReview(
    shareId,
    ownerSecret,
    new Uint8Array([2]),
  );

  // Verify
  const secondShareInfo = (await secondResponse.json()) as ShareInfo;
  expect(secondShareInfo.versionId).not.toBe(firstShareInfo.versionId);
  const oldVersionResponse = await shareServerFetch(
    shareApiPaths.reviewVersion(shareId, firstShareInfo.versionId),
  );
  expect(oldVersionResponse.status).toBe(404);
});

it("refuses to replace the review without the owner secret", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));

  // Exercise
  const response = await putTestReview(
    shareId,
    randomTestId(32),
    new Uint8Array([2]),
  );

  // Verify
  expect(response.status).toBe(403);
});

it("refuses a review larger than the limit", async () => {
  // Exercise
  const response = await putTestReview(
    randomTestId(),
    randomTestId(32),
    new Uint8Array(shareLimits.maxReviewBytes + 1),
  );

  // Verify
  expect(response.status).toBe(413);
});

it("refuses an upload without a valid owner secret", async () => {
  // Exercise
  const response = await shareServerFetch(
    shareApiPaths.review(randomTestId()),
    {
      method: "PUT",
      headers: { Authorization: "Bearer short" },
      body: new Uint8Array([1]),
    },
  );

  // Verify
  expect(response.status).toBe(401);
});

it("responds not found for a share that doesn't exist", async () => {
  // Exercise
  const response = await shareServerFetch(shareApiPaths.share(randomTestId()));

  // Verify
  expect(response.status).toBe(404);
});

it("deletes the share when the owner asks", async () => {
  // Setup SUT
  const shareId = randomTestId();
  const ownerSecret = randomTestId(32);
  await putTestReview(shareId, ownerSecret, new Uint8Array([1]));

  // Exercise
  const response = await shareServerFetch(shareApiPaths.share(shareId), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ownerSecret}` },
  });

  // Verify
  expect(response.status).toBe(204);
  const shareResponse = await shareServerFetch(shareApiPaths.share(shareId));
  expect(shareResponse.status).toBe(404);
});

it("refuses to delete the share without the owner secret", async () => {
  // Setup SUT
  const shareId = randomTestId();
  await putTestReview(shareId, randomTestId(32), new Uint8Array([1]));

  // Exercise
  const response = await shareServerFetch(shareApiPaths.share(shareId), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${randomTestId(32)}` },
  });

  // Verify
  expect(response.status).toBe(403);
});

it("responds not found for paths outside the share API", async () => {
  // Exercise
  const response = await shareServerFetch("/api/shares/not-an-id");

  // Verify
  expect(response.status).toBe(404);
});
