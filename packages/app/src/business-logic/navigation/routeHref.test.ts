import { expect, it } from "vitest";
import parseLocation from "./parseLocation.ts";
import routeHref from "./routeHref.ts";
import RouteName from "./RouteName.ts";

it("builds a step URL that parses back to the same route", () => {
  // Setup SUT
  const route = {
    name: RouteName.Step,
    reviewAddress: { kind: "local", reviewId: "3f9a0c21b7e4d2" },
    stepId: "ids/v2",
  } as const;

  // Exercise
  const href = routeHref(route);

  // Verify
  const url = new URL(href, "https://step-review.dev");
  expect(parseLocation(url.pathname, url.hash).route).toEqual(route);
});

it("builds a shared step URL that parses back to the same route and fragment", () => {
  // Setup SUT
  const route = {
    name: RouteName.Step,
    reviewAddress: {
      kind: "shared",
      shareId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      shareKey: "Abc-_123",
    },
    stepId: "ids/v2",
  } as const;

  // Exercise
  const href = routeHref(route, "note-retry limit");

  // Verify
  const url = new URL(href, "https://step-review.dev");
  expect(parseLocation(url.pathname, url.hash)).toEqual({
    route,
    fragment: "note-retry limit",
  });
});

it("keeps a local review's fragment as the element ID alone", () => {
  // Exercise
  const href = routeHref(
    {
      name: RouteName.Overview,
      reviewAddress: { kind: "local", reviewId: "3f9a0c21b7e4d2" },
    },
    "note-retry",
  );

  // Verify
  expect(href).toBe("/r/3f9a0c21b7e4d2/overview#note-retry");
});
