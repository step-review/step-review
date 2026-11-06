import { expect, it } from "vitest";
import readingLineFileIndex from "./readingLineFileIndex.ts";

it("returns the file whose card crosses the reading line, not one still showing above it", () => {
  // Exercise
  const index = readingLineFileIndex(
    [
      { top: -500, bottom: 200 },
      { top: 216, bottom: 1000 },
    ],
    900,
    false,
  );

  // Verify
  expect(index).toBe(1);
});

it("returns the file above the reading line when the line falls between two cards", () => {
  // Exercise
  const index = readingLineFileIndex(
    [
      { top: -500, bottom: 290 },
      { top: 310, bottom: 800 },
    ],
    900,
    false,
  );

  // Verify
  expect(index).toBe(0);
});

it("returns null when no card reaches the reading line", () => {
  // Exercise
  const index = readingLineFileIndex([{ top: 400, bottom: 800 }], 900, false);

  // Verify
  expect(index).toBeNull();
});

it("returns the last file whose card's top shows once the page is scrolled to the bottom", () => {
  // Exercise
  const index = readingLineFileIndex(
    [
      { top: -500, bottom: 100 },
      { top: 116, bottom: 400 },
      { top: 416, bottom: 600 },
    ],
    900,
    true,
  );

  // Verify
  expect(index).toBe(2);
});

it("uses the reading line at the bottom of the page when no card's top shows", () => {
  // Exercise
  const index = readingLineFileIndex(
    [
      { top: -3000, bottom: -100 },
      { top: -84, bottom: 900 },
    ],
    900,
    true,
  );

  // Verify
  expect(index).toBe(1);
});
