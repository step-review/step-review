import { expect, it } from "vitest";
import runCli from "./runCli.ts";

it("shows the usage when build is run without --output", async () => {
  // Exercise
  const result = await runCli(["build", "review.json"], process.cwd());

  // Verify
  expect(result).toEqual({
    exitCode: 2,
    output: expect.stringMatching(
      /^build needs one JSON file and --output\.\n\nUsage:/u,
    ) as unknown,
  });
});

it("shows the usage for an unknown command", async () => {
  // Exercise
  const result = await runCli(["publish"], process.cwd());

  // Verify
  expect(result).toEqual({
    exitCode: 2,
    output: expect.stringMatching(
      /^Unknown command `publish`\.\n\nUsage:/u,
    ) as unknown,
  });
});

it("reports a file that can't be read without a stack trace", async () => {
  // Exercise
  const result = await runCli(["check", "missing.step-review"], process.cwd());

  // Verify
  expect(result).toEqual({
    exitCode: 2,
    output: expect.stringMatching(
      /^ENOENT: no such file or directory/u,
    ) as unknown,
  });
});
