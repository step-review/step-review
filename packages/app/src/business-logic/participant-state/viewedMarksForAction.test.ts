import { expect, it } from "vitest";
import viewedMarksForAction from "./viewedMarksForAction.ts";

it("marks files at the current time when nobody marked them", () => {
  // Exercise
  const viewedMarks = viewedMarksForAction(
    { type: "setViewed", fingerprints: ["a1", "b2"], viewed: true },
    new Map(),
    5000,
  );

  // Verify
  expect(viewedMarks).toEqual([
    { fingerprint: "a1", viewed: true, at: 5000 },
    { fingerprint: "b2", viewed: true, at: 5000 },
  ]);
});

it("marks a file later than its latest mark when that mark is ahead of the current time", () => {
  // Exercise
  const viewedMarks = viewedMarksForAction(
    { type: "setViewed", fingerprints: ["a1"], viewed: false },
    new Map([["a1", { viewed: true, at: 9000, viewerIds: ["bob"] }]]),
    5000,
  );

  // Verify
  expect(viewedMarks).toEqual([{ fingerprint: "a1", viewed: false, at: 9001 }]);
});

it("doesn't mark a file past the largest safe integer", () => {
  // Exercise
  const viewedMarks = viewedMarksForAction(
    { type: "setViewed", fingerprints: ["a1"], viewed: false },
    new Map([
      ["a1", { viewed: true, at: Number.MAX_SAFE_INTEGER, viewerIds: ["bob"] }],
    ]),
    5000,
  );

  // Verify
  expect(viewedMarks[0]?.at).toBe(Number.MAX_SAFE_INTEGER);
});

it("marks every viewed file as not viewed on reset", () => {
  // Exercise
  const viewedMarks = viewedMarksForAction(
    { type: "resetViewed" },
    new Map([
      ["a1", { viewed: true, at: 1000, viewerIds: ["bob"] }],
      ["b2", { viewed: false, at: 2000, viewerIds: [] }],
    ]),
    5000,
  );

  // Verify
  expect(viewedMarks).toEqual([{ fingerprint: "a1", viewed: false, at: 5000 }]);
});

it("marks only the files whose status differs from the replacing state", () => {
  // Exercise
  const viewedMarks = viewedMarksForAction(
    { type: "replace", reviewState: { viewedFingerprints: ["a1", "c3"] } },
    new Map([
      ["a1", { viewed: true, at: 1000, viewerIds: ["bob"] }],
      ["b2", { viewed: true, at: 2000, viewerIds: ["bob"] }],
    ]),
    5000,
  );

  // Verify
  expect(viewedMarks).toEqual([
    { fingerprint: "b2", viewed: false, at: 5000 },
    { fingerprint: "c3", viewed: true, at: 5000 },
  ]);
});
