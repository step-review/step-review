import { expect, it } from "vitest";
import computeSidebarLayout from "./computeSidebarLayout.ts";

it("stacks the sidebar above the content on viewports narrower than 768px", () => {
  // Exercise
  const sidebarLayout = computeSidebarLayout(767);

  // Verify
  expect(sidebarLayout.isStacked).toBe(true);
});

it("puts the sidebar beside the content on viewports 768px wide", () => {
  // Exercise
  const sidebarLayout = computeSidebarLayout(768);

  // Verify
  expect(sidebarLayout.isStacked).toBe(false);
});

it("has room for the sidebar when its minimum width leaves the content 720px", () => {
  // Exercise
  const sidebarLayout = computeSidebarLayout(1120);

  // Verify
  expect(sidebarLayout.hasRoomForSidebar).toBe(true);
});

it("has no room for the sidebar when its minimum width leaves the content less than 720px", () => {
  // Exercise
  const sidebarLayout = computeSidebarLayout(1119);

  // Verify
  expect(sidebarLayout.hasRoomForSidebar).toBe(false);
});

it("lets the sidebar grow only as far as it leaves the content 720px", () => {
  // Exercise
  const sidebarLayout = computeSidebarLayout(1200);

  // Verify
  expect(sidebarLayout.sidebarWidthRange).toEqual({ min: 400, max: 480 });
});

it("lets the sidebar grow to 600px on wide viewports", () => {
  // Exercise
  const sidebarLayout = computeSidebarLayout(2000);

  // Verify
  expect(sidebarLayout.sidebarWidthRange).toEqual({ min: 400, max: 600 });
});

it("keeps the sidebar's maximum width at its minimum when there is no room for it", () => {
  // Exercise
  const sidebarLayout = computeSidebarLayout(900);

  // Verify
  expect(sidebarLayout.sidebarWidthRange).toEqual({ min: 400, max: 400 });
});
