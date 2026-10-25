import { expect, it } from "vitest";
import reduceParticipantState from "./reduceParticipantState.ts";

it("replaces a file's mark with a later one", () => {
  // Exercise
  const participantState = reduceParticipantState(
    {
      name: "Ada",
      viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
    },
    {
      type: "addViewedMarks",
      viewedMarks: [{ fingerprint: "a1", viewed: false, at: 2000 }],
    },
  );

  // Verify
  expect(participantState.viewedMarks).toEqual([
    { fingerprint: "a1", viewed: false, at: 2000 },
  ]);
});

it("keeps a file's mark when an earlier one is added, e.g. from another tab", () => {
  // Exercise
  const participantState = reduceParticipantState(
    {
      name: "Ada",
      viewedMarks: [{ fingerprint: "a1", viewed: false, at: 2000 }],
    },
    {
      type: "addViewedMarks",
      viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
    },
  );

  // Verify
  expect(participantState.viewedMarks).toEqual([
    { fingerprint: "a1", viewed: false, at: 2000 },
  ]);
});

it("trims a new name and cuts it to the maximum length", () => {
  // Exercise
  const participantState = reduceParticipantState(
    { name: "Ada", viewedMarks: [] },
    { type: "rename", name: `  ${"x".repeat(100)}  ` },
  );

  // Verify
  expect(participantState.name).toBe("x".repeat(60));
});
