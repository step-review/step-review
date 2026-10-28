import { expect, it } from "vitest";
import isPlainClick from "./isPlainClick.ts";

it("treats a left click without modifier keys as plain", () => {
  // Exercise
  const isPlain = isPlainClick({
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  });

  // Verify
  expect(isPlain).toBe(true);
});

it.each(["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)(
  "does not treat a left click with %s held as plain",
  (modifierKey) => {
    // Exercise
    const isPlain = isPlainClick({
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      [modifierKey]: true,
    });

    // Verify
    expect(isPlain).toBe(false);
  },
);

it("does not treat a middle click as plain", () => {
  // Exercise
  const isPlain = isPlainClick({
    button: 1,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  });

  // Verify
  expect(isPlain).toBe(false);
});
