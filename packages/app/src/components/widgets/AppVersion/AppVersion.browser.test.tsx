import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import AppVersion from "./AppVersion.tsx";

it("shows a development build's version without a link to a release", async () => {
  // Exercise
  const screen = await render(<AppVersion />, { wrapper: TestProviders });

  // Verify
  expect({
    text: screen.container.textContent,
    links: screen.container.querySelectorAll("a").length,
  }).toEqual({
    text: expect.stringMatching(/^v\d+\.\d+\.\d+-dev$/u) as unknown,
    links: 0,
  });
});
