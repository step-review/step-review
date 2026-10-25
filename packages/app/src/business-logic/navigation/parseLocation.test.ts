import { expect, it } from "vitest";
import parseLocation from "./parseLocation.ts";
import RouteName from "./RouteName.ts";

it("routes the root path to the start page", () => {
  // Exercise
  const { route } = parseLocation("/", "");

  // Verify
  expect(route).toEqual({ name: RouteName.Start });
});

it.each(["/r/3f9a0c21b7e4d2/overview", "/r/3f9a0c21b7e4d2/overview/"])(
  "routes %s to the review's overview",
  (pathname) => {
    // Exercise
    const { route } = parseLocation(pathname, "");

    // Verify
    expect(route).toEqual({
      name: RouteName.Overview,
      reviewAddress: { kind: "local", reviewId: "3f9a0c21b7e4d2" },
    });
  },
);

it("routes a step path to the review's step, decoding its ID", () => {
  // Exercise
  const { route } = parseLocation("/r/3f9a0c21b7e4d2/steps/sync%20buckets", "");

  // Verify
  expect(route).toEqual({
    name: RouteName.Step,
    reviewAddress: { kind: "local", reviewId: "3f9a0c21b7e4d2" },
    stepId: "sync buckets",
  });
});

it("reads the decoded fragment of a local review's URL", () => {
  // Exercise
  const { fragment } = parseLocation(
    "/r/3f9a0c21b7e4d2/steps/one",
    "#note-retry%20limit",
  );

  // Verify
  expect(fragment).toBe("note-retry limit");
});

it("routes a session's step path, reading the key from the fragment", () => {
  // Exercise
  const { route } = parseLocation(
    "/s/Qx2mT9vK4pLw8nR1sYb7Ze/steps/one",
    "#key=Abc-_123&to=note-retry",
  );

  // Verify
  expect(route).toEqual({
    name: RouteName.Step,
    reviewAddress: {
      kind: "session",
      sessionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      sessionKey: "Abc-_123",
    },
    stepId: "one",
  });
});

it("reads the element to scroll to from a session's fragment", () => {
  // Exercise
  const { fragment } = parseLocation(
    "/s/Qx2mT9vK4pLw8nR1sYb7Ze/steps/one",
    "#key=Abc-_123&to=note-retry%20limit",
  );

  // Verify
  expect(fragment).toBe("note-retry limit");
});

it("routes a session's URL without a key to the session, with no key", () => {
  // Exercise
  const { route } = parseLocation("/s/Qx2mT9vK4pLw8nR1sYb7Ze/overview", "");

  // Verify
  expect(route).toEqual({
    name: RouteName.Overview,
    reviewAddress: {
      kind: "session",
      sessionId: "Qx2mT9vK4pLw8nR1sYb7Ze",
      sessionKey: null,
    },
  });
});

it.each([
  "/overview",
  "/steps/one",
  "/r/3f9a0c21b7e4d2",
  "/r/3f9a0c21b7e4d2/steps",
  "/r/3f9a0c21b7e4d2/steps/one/two",
  "/r/3f9a0c21b7e4d2/overview/steps/one",
  "/s/Qx2mT9vK4pLw8nR1sYb7Ze",
  "/x/3f9a0c21b7e4d2/overview",
])("routes %s to not found", (pathname) => {
  // Exercise
  const { route } = parseLocation(pathname, "");

  // Verify
  expect(route).toEqual({ name: RouteName.NotFound });
});
