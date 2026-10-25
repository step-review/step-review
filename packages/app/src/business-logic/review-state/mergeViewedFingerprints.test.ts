import { expect, it } from "vitest";
import mergeViewedFingerprints from "./mergeViewedFingerprints.ts";

it("counts as viewed the files that any participant viewed", () => {
  // Exercise
  const viewedFingerprints = mergeViewedFingerprints(
    ["a1", "a2"],
    [
      { name: "Bob", viewedFingerprints: ["b1", "a2"] },
      { name: "Cleo", viewedFingerprints: ["c1"] },
    ],
  );

  // Verify
  expect([...viewedFingerprints].toSorted()).toEqual(["a1", "a2", "b1", "c1"]);
});

it("counts as viewed only the own files when there are no other participants", () => {
  // Exercise
  const viewedFingerprints = mergeViewedFingerprints(["a1"], []);

  // Verify
  expect([...viewedFingerprints]).toEqual(["a1"]);
});
