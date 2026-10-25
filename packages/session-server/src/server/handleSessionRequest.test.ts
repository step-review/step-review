import { expect, it } from "vitest";
import sessionApiPaths from "../protocol/sessionApiPaths.ts";
import type SessionInfo from "../protocol/SessionInfo.ts";
import sessionLimits from "../protocol/sessionLimits.ts";
import putTestReview from "../test-utils/putTestReview.ts";
import randomTestId from "../test-utils/randomTestId.ts";
import sessionServerFetch from "../test-utils/sessionServerFetch.ts";

it("returns the version to load after a session is created", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  const response = await putTestReview(
    sessionId,
    randomTestId(32),
    new Uint8Array([1, 2, 3]),
  );
  const { versionId } = (await response.json()) as SessionInfo;

  // Exercise
  const sessionResponse = await sessionServerFetch(
    sessionApiPaths.session(sessionId),
  );

  // Verify
  expect(await sessionResponse.json()).toEqual({ versionId });
});

it("returns the uploaded review, larger than a storage row, by its version", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  const review = new Uint8Array(2_500_000).map((_, index) => index % 251);
  const response = await putTestReview(sessionId, randomTestId(32), review);
  const { versionId } = (await response.json()) as SessionInfo;

  // Exercise
  const versionResponse = await sessionServerFetch(
    sessionApiPaths.reviewVersion(sessionId, versionId),
  );

  // Verify
  // Compared as buffers: deep equality is slow on millions of elements.
  const receivedReview = Buffer.from(await versionResponse.arrayBuffer());
  expect(receivedReview.equals(review)).toBe(true);
  expect(versionResponse.headers.get("Cache-Control")).toContain("immutable");
});

it("replaces the review, and its version, when the owner uploads it again", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  const ownerSecret = randomTestId(32);
  const firstResponse = await putTestReview(
    sessionId,
    ownerSecret,
    new Uint8Array([1]),
  );
  const firstSessionInfo = (await firstResponse.json()) as SessionInfo;

  // Exercise
  const secondResponse = await putTestReview(
    sessionId,
    ownerSecret,
    new Uint8Array([2]),
  );

  // Verify
  const secondSessionInfo = (await secondResponse.json()) as SessionInfo;
  expect(secondSessionInfo.versionId).not.toBe(firstSessionInfo.versionId);
  const oldVersionResponse = await sessionServerFetch(
    sessionApiPaths.reviewVersion(sessionId, firstSessionInfo.versionId),
  );
  expect(oldVersionResponse.status).toBe(404);
});

it("refuses to replace the review without the owner secret", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));

  // Exercise
  const response = await putTestReview(
    sessionId,
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
    new Uint8Array(sessionLimits.maxReviewBytes + 1),
  );

  // Verify
  expect(response.status).toBe(413);
});

it("refuses an upload without a valid owner secret", async () => {
  // Exercise
  const response = await sessionServerFetch(
    sessionApiPaths.review(randomTestId()),
    {
      method: "PUT",
      headers: { Authorization: "Bearer short" },
      body: new Uint8Array([1]),
    },
  );

  // Verify
  expect(response.status).toBe(401);
});

it("responds not found for a session that doesn't exist", async () => {
  // Exercise
  const response = await sessionServerFetch(
    sessionApiPaths.session(randomTestId()),
  );

  // Verify
  expect(response.status).toBe(404);
});

it("deletes the session when the owner asks", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  const ownerSecret = randomTestId(32);
  await putTestReview(sessionId, ownerSecret, new Uint8Array([1]));

  // Exercise
  const response = await sessionServerFetch(
    sessionApiPaths.session(sessionId),
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${ownerSecret}` },
    },
  );

  // Verify
  expect(response.status).toBe(204);
  const sessionResponse = await sessionServerFetch(
    sessionApiPaths.session(sessionId),
  );
  expect(sessionResponse.status).toBe(404);
});

it("refuses to delete the session without the owner secret", async () => {
  // Setup SUT
  const sessionId = randomTestId();
  await putTestReview(sessionId, randomTestId(32), new Uint8Array([1]));

  // Exercise
  const response = await sessionServerFetch(
    sessionApiPaths.session(sessionId),
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${randomTestId(32)}` },
    },
  );

  // Verify
  expect(response.status).toBe(403);
});

it("responds not found for paths outside the session API", async () => {
  // Exercise
  const response = await sessionServerFetch("/api/sessions/not-an-id");

  // Verify
  expect(response.status).toBe(404);
});
