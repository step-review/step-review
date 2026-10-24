import { expect, it } from "vitest";
import parseRoute from "./parseRoute.ts";
import RouteName from "./RouteName.ts";

it("routes the root path to the start page", () => {
  // Exercise
  const route = parseRoute("/");

  // Verify
  expect(route).toEqual({ name: RouteName.Start });
});

it.each(["/r/3f9a0c21b7e4d2/overview", "/r/3f9a0c21b7e4d2/overview/"])(
  "routes %s to the review's overview",
  (pathname) => {
    // Exercise
    const route = parseRoute(pathname);

    // Verify
    expect(route).toEqual({
      name: RouteName.Overview,
      reviewId: "3f9a0c21b7e4d2",
    });
  },
);

it("routes a step path to the review's step, decoding its ID", () => {
  // Exercise
  const route = parseRoute("/r/3f9a0c21b7e4d2/steps/sync%20buckets");

  // Verify
  expect(route).toEqual({
    name: RouteName.Step,
    reviewId: "3f9a0c21b7e4d2",
    stepId: "sync buckets",
  });
});

it.each([
  "/overview",
  "/steps/one",
  "/r/3f9a0c21b7e4d2",
  "/r/3f9a0c21b7e4d2/steps",
  "/r/3f9a0c21b7e4d2/steps/one/two",
  "/r/3f9a0c21b7e4d2/overview/steps/one",
])("routes %s to not found", (pathname) => {
  // Exercise
  const route = parseRoute(pathname);

  // Verify
  expect(route).toEqual({ name: RouteName.NotFound });
});
