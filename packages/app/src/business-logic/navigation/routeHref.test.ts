import { expect, it } from "vitest";
import parseRoute from "./parseRoute.ts";
import routeHref from "./routeHref.ts";
import RouteName from "./RouteName.ts";

it("builds a step URL that parses back to the same route", () => {
  // Setup SUT
  const route = {
    name: RouteName.Step,
    roundNumber: 3,
    stepId: "ids/v2",
  } as const;

  // Exercise
  const href = routeHref(route);

  // Verify
  expect(parseRoute(href)).toEqual(route);
});
