import { expect, it } from "vitest";
import resolveReleasePlan from "./resolveReleasePlan.ts";

it("releases the committed version to latest in production", () => {
  // Exercise
  const plan = resolveReleasePlan("1.2.3", ["--production"]);

  // Verify
  expect(plan).toEqual({ version: "1.2.3", channel: "latest", preview: false });
});

it("publishes a preview of a PR under the PR's dist-tag", () => {
  // Exercise
  const plan = resolveReleasePlan("1.2.3", [
    "--pr",
    "42",
    "--revision",
    "0123456789abcdef0123456789abcdef01234567",
  ]);

  // Verify
  expect(plan).toEqual({
    version: "1.2.3-pr.42.sha0123456789ab",
    channel: "pr-42",
    preview: true,
  });
});

it("rejects a PR preview without a revision", () => {
  // Exercise and verify
  expect(() => resolveReleasePlan("1.2.3", ["--pr", "42"])).toThrow(
    "Choose exactly one target",
  );
});

it("rejects both targets at once", () => {
  // Exercise and verify
  expect(() =>
    resolveReleasePlan("1.2.3", [
      "--production",
      "--pr",
      "42",
      "--revision",
      "0123456789abcdef0123456789abcdef01234567",
    ]),
  ).toThrow("Choose exactly one target");
});
