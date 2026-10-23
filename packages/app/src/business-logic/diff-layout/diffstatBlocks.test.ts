import { expect, it } from "vitest";
import diffstatBlocks from "./diffstatBlocks.ts";

it("fills one block per changed line when fewer than five lines changed", () => {
  // Exercise
  const blocks = diffstatBlocks(3, 1);

  // Verify
  expect(blocks).toEqual(["added", "added", "added", "deleted", "neutral"]);
});

it("splits the five blocks in proportion when many lines changed", () => {
  // Exercise
  const blocks = diffstatBlocks(54, 31);

  // Verify
  expect(blocks).toEqual(["added", "added", "added", "deleted", "deleted"]);
});

it("leaves every block neutral when nothing changed", () => {
  // Exercise
  const blocks = diffstatBlocks(0, 0);

  // Verify
  expect(blocks).toEqual([
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
  ]);
});
