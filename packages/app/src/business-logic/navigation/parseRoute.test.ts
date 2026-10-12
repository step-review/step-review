import { expect, it } from "vitest";
import parseRoute from "./parseRoute.ts";
import RouteName from "./RouteName.ts";

it("routes the root path to the start page", () => {
  // Exercise
  const route = parseRoute("/");

  // Verify
  expect(route).toEqual({ name: RouteName.Start });
});

it.each(["/rounds/2", "/rounds/2/"])(
  "routes %s to the overview of round 2",
  (pathname) => {
    // Exercise
    const route = parseRoute(pathname);

    // Verify
    expect(route).toEqual({ name: RouteName.Overview, roundNumber: 2 });
  },
);

it("routes a step path to the step, decoding its ID", () => {
  // Exercise
  const route = parseRoute("/rounds/1/steps/sync%20buckets");

  // Verify
  expect(route).toEqual({
    name: RouteName.Step,
    roundNumber: 1,
    stepId: "sync buckets",
  });
});

it.each(["/rounds/0", "/rounds/abc", "/steps/one", "/rounds/1/steps"])(
  "routes %s to not found",
  (pathname) => {
    // Exercise
    const route = parseRoute(pathname);

    // Verify
    expect(route).toEqual({ name: RouteName.NotFound });
  },
);
