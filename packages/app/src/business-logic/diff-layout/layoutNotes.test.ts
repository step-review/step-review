import { expect, it } from "vitest";
import layoutNotes from "./layoutNotes.ts";

it("places notes at their anchors when they don't overlap", () => {
  // Exercise
  const layout = layoutNotes(
    [
      { id: "a", anchorTop: 0, height: 40 },
      { id: "b", anchorTop: 100, height: 40 },
    ],
    8,
  );

  // Verify
  expect([...layout.tops]).toEqual([
    ["a", 0],
    ["b", 100],
  ]);
});

it("pushes a note below the previous one when they would overlap", () => {
  // Exercise
  const layout = layoutNotes(
    [
      { id: "b", anchorTop: 20, height: 40 },
      { id: "a", anchorTop: 0, height: 40 },
    ],
    8,
  );

  // Verify
  expect([...layout.tops]).toEqual([
    ["a", 0],
    ["b", 48],
  ]);
});
