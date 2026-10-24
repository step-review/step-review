import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import InitialsAvatar from "./InitialsAvatar.tsx";

it.each([
  ["Ada Lovelace", "AL"],
  ["ada", "A"],
  ["Jean Paul Sartre", "JP"],
  ["", "?"],
  ["👩‍💻 Dev", "👩‍💻D"],
])("shows the initials of %j as %j", async (name, initials) => {
  // Exercise
  const screen = await render(
    <InitialsAvatar name={name} label={name} colorIndex={0} />,
    { wrapper: TestProviders },
  );

  // Verify
  expect(screen.container.textContent).toBe(initials);
});
