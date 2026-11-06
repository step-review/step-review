import { expect, it } from "vitest";
import revealingScrollTop from "./revealingScrollTop.ts";

it("keeps the scroll position when the item shows within the margins", () => {
  // Exercise
  const scrollTop = revealingScrollTop(
    { top: 300, bottom: 330 },
    { top: 100, bottom: 600 },
    200,
    40,
  );

  // Verify
  expect(scrollTop).toBe(200);
});

it("scrolls up until an item above the top margin is at the margin", () => {
  // Exercise
  const scrollTop = revealingScrollTop(
    { top: 50, bottom: 80 },
    { top: 100, bottom: 600 },
    200,
    40,
  );

  // Verify
  expect(scrollTop).toBe(110);
});

it("scrolls down until an item below the bottom margin is at the margin", () => {
  // Exercise
  const scrollTop = revealingScrollTop(
    { top: 650, bottom: 680 },
    { top: 100, bottom: 600 },
    200,
    40,
  );

  // Verify
  expect(scrollTop).toBe(320);
});

it("shrinks the margins to center an item too tall for them", () => {
  // Exercise
  const scrollTop = revealingScrollTop(
    { top: 620, bottom: 700 },
    { top: 100, bottom: 200 },
    0,
    40,
  );

  // Verify
  expect(scrollTop).toBe(510);
});

it("scrolls an item taller than the scroll area to its top", () => {
  // Exercise
  const scrollTop = revealingScrollTop(
    { top: 300, bottom: 500 },
    { top: 100, bottom: 200 },
    0,
    40,
  );

  // Verify
  expect(scrollTop).toBe(200);
});
