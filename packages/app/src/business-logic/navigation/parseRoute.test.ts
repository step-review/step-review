import { expect, it } from "vitest";
import parseRoute from "./parseRoute.ts";
import RouteName from "./RouteName.ts";

it("routes the root path to the start page", () => {
  // Exercise
  const route = parseRoute("/");

  // Verify
  expect(route).toEqual({ name: RouteName.Start });
});

it.each(["/overview", "/overview/"])(
  "routes %s to the overview",
  (pathname) => {
    // Exercise
    const route = parseRoute(pathname);

    // Verify
    expect(route).toEqual({ name: RouteName.Overview });
  },
);

it("routes a step path to the step, decoding its ID", () => {
  // Exercise
  const route = parseRoute("/steps/sync%20buckets");

  // Verify
  expect(route).toEqual({ name: RouteName.Step, stepId: "sync buckets" });
});

it.each(["/rounds/1", "/steps", "/steps/one/two", "/overview/steps/one"])(
  "routes %s to not found",
  (pathname) => {
    // Exercise
    const route = parseRoute(pathname);

    // Verify
    expect(route).toEqual({ name: RouteName.NotFound });
  },
);
