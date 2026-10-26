import type { FileDiff, ReviewData } from "@step-review/review-format";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import StepNavigation from "./StepNavigation.tsx";

it("hides the active step's files when clicking it, keeping it current", async () => {
  // Setup SUT
  const reviewView: ReviewView = {
    reviewAddress: { kind: "local", reviewId: "review-1" },
    data: {} as ReviewData,
    diff: [] as FileDiff[],
    steps: [
      {
        id: "step-1",
        number: 1,
        title: "Add the parser",
        attention: "normal",
        intro: null,
        notes: [],
        files: [],
      },
    ],
  };
  const screen = await render(
    <ReviewViewProvider reviewView={reviewView}>
      <StepNavigation
        reviewView={reviewView}
        activeStepId="step-1"
        onNavigate={() => undefined}
      />
    </ReviewViewProvider>,
    { wrapper: TestProviders },
  );

  // Exercise
  await screen.getByRole("link", { name: /Add the parser/ }).click();

  // Verify
  await expect
    .element(screen.getByRole("tree", { name: "Files of the step" }))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("link", { name: /Add the parser/ }))
    .toHaveAttribute("aria-current", "page");
});

it("shows the active step's files again when clicking it a second time", async () => {
  // Setup SUT
  const reviewView: ReviewView = {
    reviewAddress: { kind: "local", reviewId: "review-1" },
    data: {} as ReviewData,
    diff: [] as FileDiff[],
    steps: [
      {
        id: "step-1",
        number: 1,
        title: "Add the parser",
        attention: "normal",
        intro: null,
        notes: [],
        files: [],
      },
    ],
  };
  const screen = await render(
    <ReviewViewProvider reviewView={reviewView}>
      <StepNavigation
        reviewView={reviewView}
        activeStepId="step-1"
        onNavigate={() => undefined}
      />
    </ReviewViewProvider>,
    { wrapper: TestProviders },
  );
  await screen.getByRole("link", { name: /Add the parser/ }).click();

  // Exercise
  await screen.getByRole("link", { name: /Add the parser/ }).click();

  // Verify
  await expect
    .element(screen.getByRole("tree", { name: "Files of the step" }))
    .toBeInTheDocument();
});

it("shows the files of a step that becomes active after another was collapsed", async () => {
  // Setup SUT
  const reviewView: ReviewView = {
    reviewAddress: { kind: "local", reviewId: "review-1" },
    data: {} as ReviewData,
    diff: [] as FileDiff[],
    steps: [
      {
        id: "step-1",
        number: 1,
        title: "Add the parser",
        attention: "normal",
        intro: null,
        notes: [],
        files: [],
      },
      {
        id: "step-2",
        number: 2,
        title: "Use the parser",
        attention: "normal",
        intro: null,
        notes: [],
        files: [],
      },
    ],
  };
  const renderNavigation = (activeStepId: string) => (
    <ReviewViewProvider reviewView={reviewView}>
      <StepNavigation
        reviewView={reviewView}
        activeStepId={activeStepId}
        onNavigate={() => undefined}
      />
    </ReviewViewProvider>
  );
  const screen = await render(renderNavigation("step-1"), {
    wrapper: TestProviders,
  });
  await screen.getByRole("link", { name: /Add the parser/ }).click();

  // Exercise
  await screen.rerender(renderNavigation("step-2"));

  // Verify
  await expect
    .element(screen.getByRole("tree", { name: "Files of the step" }))
    .toBeInTheDocument();
});
