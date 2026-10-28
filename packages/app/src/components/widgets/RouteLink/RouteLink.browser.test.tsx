import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import navigateTo from "../../../business-logic/navigation/navigateTo.ts";
import RouteName from "../../../business-logic/navigation/RouteName.ts";
import RouteLink from "./RouteLink.tsx";

vi.mock("../../../business-logic/navigation/navigateTo.ts");

/**
 * Clicks the link with a synthetic event, returning whether the app prevented
 * the browser from following the link. The browser is kept from following it
 * either way, so that the test page stays where it is.
 */
function clickAndCheckIfPrevented(
  link: HTMLElement,
  eventInit: MouseEventInit,
): boolean {
  let isPrevented = false;
  window.addEventListener(
    "click",
    (event) => {
      isPrevented = event.defaultPrevented;
      event.preventDefault();
    },
    { once: true },
  );
  link.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, ...eventInit }),
  );
  return isPrevented;
}

it("links to the route's URL", async () => {
  // Exercise
  const screen = await render(
    <RouteLink
      route={{
        name: RouteName.Step,
        reviewAddress: { kind: "local", reviewId: "review-1" },
        stepId: "step-1",
      }}
      fragment="note-1"
    >
      Add the parser
    </RouteLink>,
  );

  // Verify
  await expect
    .element(screen.getByRole("link", { name: "Add the parser" }))
    .toHaveAttribute("href", "/r/review-1/steps/step-1#note-1");
});

it("navigates within the app on a plain click", async () => {
  // Setup mocks
  vi.mocked(navigateTo).mockReset();

  // Setup SUT
  const onNavigate = vi.fn();
  const screen = await render(
    <RouteLink route={{ name: RouteName.Privacy }} onNavigate={onNavigate}>
      Privacy
    </RouteLink>,
  );

  // Exercise
  const isPrevented = clickAndCheckIfPrevented(
    screen.getByRole("link", { name: "Privacy" }).element() as HTMLElement,
    {},
  );

  // Verify
  expect({
    isPrevented,
    navigateToCalls: vi.mocked(navigateTo).mock.calls,
    onNavigateCallCount: onNavigate.mock.calls.length,
  }).toEqual({
    isPrevented: true,
    navigateToCalls: [[{ name: RouteName.Privacy }, undefined]],
    onNavigateCallCount: 1,
  });
});

it.each(["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)(
  "leaves a click with %s held to the browser",
  async (modifierKey) => {
    // Setup mocks
    vi.mocked(navigateTo).mockReset();

    // Setup SUT
    const onNavigate = vi.fn();
    const screen = await render(
      <RouteLink route={{ name: RouteName.Privacy }} onNavigate={onNavigate}>
        Privacy
      </RouteLink>,
    );

    // Exercise
    const isPrevented = clickAndCheckIfPrevented(
      screen.getByRole("link", { name: "Privacy" }).element() as HTMLElement,
      { [modifierKey]: true },
    );

    // Verify
    expect({
      isPrevented,
      navigateToCallCount: vi.mocked(navigateTo).mock.calls.length,
      onNavigateCallCount: onNavigate.mock.calls.length,
    }).toEqual({
      isPrevented: false,
      navigateToCallCount: 0,
      onNavigateCallCount: 0,
    });
  },
);

it("does not navigate when its click handler prevents the default action", async () => {
  // Setup mocks
  vi.mocked(navigateTo).mockReset();

  // Setup SUT
  const screen = await render(
    <RouteLink
      route={{ name: RouteName.Privacy }}
      onClick={(event) => event.preventDefault()}
    >
      Privacy
    </RouteLink>,
  );

  // Exercise
  clickAndCheckIfPrevented(
    screen.getByRole("link", { name: "Privacy" }).element() as HTMLElement,
    {},
  );

  // Verify
  expect(vi.mocked(navigateTo)).not.toHaveBeenCalled();
});
