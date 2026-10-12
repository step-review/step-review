import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import exampleReviewPath from "./exampleReviewPath.ts";
import loadReview from "./loadReview.ts";

it("loads the example review without problems or warnings", () => {
  // Setup SUT
  const text = readFileSync(
    new URL(`../../../public${exampleReviewPath}`, import.meta.url),
    "utf8",
  );

  // Exercise
  const result = loadReview("example.step-review", text);

  // Verify
  expect(result.success).toBe(true);
  expect(result.success && result.loadedReview.warnings).toEqual([]);
});
