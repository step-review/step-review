import { expect, it } from "vitest";
import reduceReviewState from "./reduceReviewState.ts";

it("marks fingerprints as viewed without duplicating them", () => {
  // Setup SUT
  const reviewState = {
    viewedFingerprints: ["a"],
  };

  // Exercise
  const nextReviewState = reduceReviewState(reviewState, {
    type: "setViewed",
    fingerprints: ["a", "b"],
    viewed: true,
  });

  // Verify
  expect(nextReviewState.viewedFingerprints).toEqual(["a", "b"]);
});

it("unmarks viewed fingerprints", () => {
  // Setup SUT
  const reviewState = {
    viewedFingerprints: ["a", "b"],
  };

  // Exercise
  const nextReviewState = reduceReviewState(reviewState, {
    type: "setViewed",
    fingerprints: ["a"],
    viewed: false,
  });

  // Verify
  expect(nextReviewState.viewedFingerprints).toEqual(["b"]);
});
