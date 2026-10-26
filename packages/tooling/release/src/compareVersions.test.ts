import { expect, it } from "vitest";
import compareVersions from "./compareVersions.ts";

it.each([
  ["1.2.3", "1.2.4", -1],
  ["1.10.0", "1.9.9", 1],
  ["2.0.0", "2.0.0", 0],
])("compares %s with %s", (a, b, expectedSign) => {
  // Exercise and verify
  expect(Math.sign(compareVersions(a, b))).toBe(expectedSign);
});
