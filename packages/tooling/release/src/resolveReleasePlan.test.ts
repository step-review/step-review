import { expect, it } from "vitest";
import resolveReleasePlan from "./resolveReleasePlan.ts";

it("releases the committed version to latest from a matching tag", () => {
  // Exercise
  const plan = resolveReleasePlan("1.2.3", {
    GITHUB_SHA: "0123456789abcdef0123456789abcdef01234567",
    GITHUB_REF_TYPE: "tag",
    GITHUB_REF_NAME: "v1.2.3",
  });

  // Verify
  expect(plan).toEqual({
    version: "1.2.3",
    channel: "latest",
    commit: "0123456789abcdef0123456789abcdef01234567",
  });
});

it("rejects a tag that doesn't match the committed version", () => {
  // Exercise and verify
  expect(() =>
    resolveReleasePlan("1.2.3", {
      GITHUB_SHA: "0123456789abcdef0123456789abcdef01234567",
      GITHUB_REF_TYPE: "tag",
      GITHUB_REF_NAME: "v1.2.4",
    }),
  ).toThrow("The tag v1.2.4 doesn't match the version 1.2.3.");
});

it("publishes a beta of a branch under the branch's name", () => {
  // Exercise
  const plan = resolveReleasePlan("1.2.3", {
    GITHUB_SHA: "0123456789abcdef0123456789abcdef01234567",
    GITHUB_REF_TYPE: "branch",
    GITHUB_REF_NAME: "review-cli",
  });

  // Verify
  expect(plan).toEqual({
    version: expect.stringMatching(
      /^1\.2\.3-beta\.review-cli-[0-9a-f]{8}\.sha0123456789ab$/u,
    ) as unknown,
    channel: "review-cli",
    commit: "0123456789abcdef0123456789abcdef01234567",
    branch: "review-cli",
  });
});

it.each(["feature/foo", "v1.2", "1.2", "latest", "branch-foo"])(
  "publishes a beta of branch %s under a generated name",
  (branch) => {
    // Exercise
    const plan = resolveReleasePlan("1.2.3", {
      GITHUB_SHA: "0123456789abcdef0123456789abcdef01234567",
      GITHUB_REF_TYPE: "branch",
      GITHUB_REF_NAME: branch,
    });

    // Verify
    expect(plan.channel).toMatch(/^branch-[a-z0-9-]+-[0-9a-f]{8}$/u);
  },
);
