import type { ReviewFile } from "@step-review/review-format";
import { beforeEach, expect, it } from "vitest";
import deleteReview from "./deleteReview.ts";
import reviewDatabase from "./reviewDatabase.ts";
import saveReview from "./saveReview.ts";
import updateReviewState from "./updateReviewState.ts";

beforeEach(async () => {
  await Promise.all(reviewDatabase.tables.map((table) => table.clear()));
});

it("keeps the review state when a review file is saved again", async () => {
  // Setup SUT
  const loadedReview = {
    reviewId: "3f9a0c21b7e4d2",
    fileName: "login.step-review",
    text: "first version",
    reviewFile: {
      data: { target: { title: "Add login" } },
    } as unknown as ReviewFile,
    warnings: [],
  };
  await saveReview(loadedReview);
  await updateReviewState("3f9a0c21b7e4d2", {
    type: "setViewed",
    fingerprints: ["a1"],
    viewed: true,
  });

  // Exercise
  await saveReview({ ...loadedReview, text: "second version" });

  // Verify
  expect(await reviewDatabase.reviewFiles.get("3f9a0c21b7e4d2")).toBe(
    "second version",
  );
  expect(await reviewDatabase.reviewStates.get("3f9a0c21b7e4d2")).toEqual({
    viewedFingerprints: ["a1"],
  });
});

it("removes the file, the state, and the listing when deleting a review", async () => {
  // Setup SUT
  await saveReview({
    reviewId: "3f9a0c21b7e4d2",
    fileName: "login.step-review",
    text: "review text",
    reviewFile: {
      data: { target: { title: "Add login" } },
    } as unknown as ReviewFile,
    warnings: [],
  });
  await updateReviewState("3f9a0c21b7e4d2", {
    type: "setViewed",
    fingerprints: ["a1"],
    viewed: true,
  });

  // Exercise
  await deleteReview("3f9a0c21b7e4d2");

  // Verify
  expect(await reviewDatabase.reviews.count()).toBe(0);
  expect(await reviewDatabase.reviewFiles.count()).toBe(0);
  expect(await reviewDatabase.reviewStates.count()).toBe(0);
});

it("applies every state update when several are made at once", async () => {
  // Exercise
  await Promise.all([
    updateReviewState("3f9a0c21b7e4d2", {
      type: "setViewed",
      fingerprints: ["a1"],
      viewed: true,
    }),
    updateReviewState("3f9a0c21b7e4d2", {
      type: "setViewed",
      fingerprints: ["b2"],
      viewed: true,
    }),
  ]);

  // Verify
  const reviewState = await reviewDatabase.reviewStates.get("3f9a0c21b7e4d2");
  expect(reviewState?.viewedFingerprints.toSorted()).toEqual(["a1", "b2"]);
});
