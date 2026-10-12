import { expect, it } from "vitest";
import splitLineSegments from "./splitLineSegments.ts";

it("splits syntax tokens at the boundaries of changed words", () => {
  // Exercise
  const segments = splitLineSegments(
    "a + b",
    [
      { content: "a ", color: "red", darkColor: "pink" },
      { content: "+ b", color: "blue", darkColor: "cyan" },
    ],
    [{ start: 2, end: 3 }],
  );

  // Verify
  expect(segments).toEqual([
    { text: "a ", color: "red", darkColor: "pink", changed: false },
    { text: "+", color: "blue", darkColor: "cyan", changed: true },
    { text: " b", color: "blue", darkColor: "cyan", changed: false },
  ]);
});

it("returns the whole line as one segment without tokens or changes", () => {
  // Exercise
  const segments = splitLineSegments("plain", undefined, undefined);

  // Verify
  expect(segments).toEqual([
    { text: "plain", color: null, darkColor: null, changed: false },
  ]);
});
