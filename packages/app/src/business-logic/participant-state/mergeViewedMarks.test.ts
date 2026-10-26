import { expect, it } from "vitest";
import mergeViewedMarks from "./mergeViewedMarks.ts";

it("counts a file as viewed when a participant viewed it", () => {
  // Exercise
  const fileViewedStatuses = mergeViewedMarks([
    [
      "ada",
      {
        name: "Ada",
        viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
      },
    ],
    ["bob", { name: "Bob", viewedMarks: [] }],
  ]);

  // Verify
  expect(fileViewedStatuses).toEqual(
    new Map([["a1", { viewed: true, at: 1000, viewerIds: ["ada"] }]]),
  );
});

it("counts a file as not viewed when another participant marks it not viewed later", () => {
  // Exercise
  const fileViewedStatuses = mergeViewedMarks([
    [
      "ada",
      {
        name: "Ada",
        viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
      },
    ],
    [
      "bob",
      {
        name: "Bob",
        viewedMarks: [{ fingerprint: "a1", viewed: false, at: 2000 }],
      },
    ],
  ]);

  // Verify
  expect(fileViewedStatuses.get("a1")).toEqual({
    viewed: false,
    at: 2000,
    viewerIds: [],
  });
});

it("lists as viewers only the participants who viewed a file after it was last marked not viewed", () => {
  // Exercise
  const fileViewedStatuses = mergeViewedMarks([
    [
      "ada",
      {
        name: "Ada",
        viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
      },
    ],
    [
      "bob",
      {
        name: "Bob",
        viewedMarks: [{ fingerprint: "a1", viewed: false, at: 2000 }],
      },
    ],
    [
      "cleo",
      {
        name: "Cleo",
        viewedMarks: [{ fingerprint: "a1", viewed: true, at: 3000 }],
      },
    ],
  ]);

  // Verify
  expect(fileViewedStatuses.get("a1")).toEqual({
    viewed: true,
    at: 3000,
    viewerIds: ["cleo"],
  });
});

it("gives marks made at the same time to the greatest participant ID, whatever the order of the participants", () => {
  // Exercise
  const fileViewedStatuses = mergeViewedMarks([
    [
      "bob",
      {
        name: "Bob",
        viewedMarks: [{ fingerprint: "a1", viewed: false, at: 1000 }],
      },
    ],
    [
      "ada",
      {
        name: "Ada",
        viewedMarks: [{ fingerprint: "a1", viewed: true, at: 1000 }],
      },
    ],
  ]);

  // Verify
  expect(fileViewedStatuses.get("a1")?.viewed).toBe(false);
});

it("lists a participant who marked a file twice as one viewer", () => {
  // Exercise
  const fileViewedStatuses = mergeViewedMarks([
    [
      "ada",
      {
        name: "Ada",
        viewedMarks: [
          { fingerprint: "a1", viewed: true, at: 1000 },
          { fingerprint: "a1", viewed: true, at: 2000 },
        ],
      },
    ],
  ]);

  // Verify
  expect(fileViewedStatuses.get("a1")).toEqual({
    viewed: true,
    at: 2000,
    viewerIds: ["ada"],
  });
});
