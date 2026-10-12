import { expect, it } from "vitest";
import reduceReviewState from "./reduceReviewState.ts";

it("marks fingerprints as viewed without duplicating them", () => {
  // Setup SUT
  const reviewState = {
    viewedFingerprints: ["a"],
    issueVerdicts: {},
    comments: [],
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
    issueVerdicts: {},
    comments: [],
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

it("updates the body of a comment", () => {
  // Setup SUT
  const reviewState = {
    viewedFingerprints: [],
    issueVerdicts: {},
    comments: [
      {
        id: "c1",
        roundNumber: 1,
        target: { kind: "step" as const, stepId: "fix" },
        body: "Old",
        createdAt: "2026-10-11T09:30:00Z",
      },
    ],
  };

  // Exercise
  const nextReviewState = reduceReviewState(reviewState, {
    type: "updateComment",
    commentId: "c1",
    body: "New",
  });

  // Verify
  expect(nextReviewState.comments.map((comment) => comment.body)).toEqual([
    "New",
  ]);
});
