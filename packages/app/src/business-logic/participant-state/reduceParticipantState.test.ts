import { expect, it } from "vitest";
import reduceParticipantState from "./reduceParticipantState.ts";

it("keeps the name when the review state is replaced", () => {
  // Exercise
  const participantState = reduceParticipantState(
    { name: "Ada", viewedFingerprints: ["a1"] },
    { type: "replace", reviewState: { viewedFingerprints: ["b2"] } },
  );

  // Verify
  expect(participantState).toEqual({ name: "Ada", viewedFingerprints: ["b2"] });
});

it("trims a new name and cuts it to the maximum length", () => {
  // Exercise
  const participantState = reduceParticipantState(
    { name: "Ada", viewedFingerprints: [] },
    { type: "rename", name: `  ${"x".repeat(100)}  ` },
  );

  // Verify
  expect(participantState.name).toBe("x".repeat(60));
});
