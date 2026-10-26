import type { FileDiff, ReviewData } from "@step-review/review-format";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import StepFileTree from "./StepFileTree.tsx";

it("shows how many issues and notes each file has", async () => {
  // Setup SUT
  const stepView: StepView = {
    id: "step-1",
    number: 1,
    title: "Add the parser",
    attention: "normal",
    intro: null,
    notes: [],
    files: [
      {
        id: "file-1",
        path: "src/parser.ts",
        fileDiff: { status: "modified" } as FileDiff,
        hunks: [],
        additions: 10,
        deletions: 0,
        summary: null,
        fingerprint: "fingerprint-1",
        notes: [
          { id: "note-1", kind: "issue", severity: "concern", body: "Slow." },
          { id: "note-2", kind: "explainer", body: "Why." },
          { id: "note-3", kind: "explainer", body: "How." },
        ],
      },
    ],
  };
  const reviewView: ReviewView = {
    reviewAddress: { kind: "local", reviewId: "review-1" },
    data: {} as ReviewData,
    diff: [],
    steps: [stepView],
  };

  // Exercise
  const screen = await render(
    <ReviewViewProvider reviewView={reviewView}>
      <StepFileTree stepView={stepView} onFileSelect={() => undefined} />
    </ReviewViewProvider>,
    { wrapper: TestProviders },
  );

  // Verify
  await expect
    .element(screen.getByRole("treeitem", { name: /parser\.ts/ }))
    .toHaveAccessibleDescription("Modified, 1 issue, and 2 notes");
  await expect.element(screen.getByText("1 issue")).toBeVisible();
  await expect.element(screen.getByText("2 notes")).toBeVisible();
});

it.each([
  ["added", "Added"],
  ["deleted", "Deleted"],
  ["modified", "Modified"],
  ["renamed", "Renamed"],
  ["copied", "Copied"],
] as const)("describes a file with status %s as %s", async (status, label) => {
  // Setup SUT
  const stepView: StepView = {
    id: "step-1",
    number: 1,
    title: "Change the parser",
    attention: "normal",
    intro: null,
    notes: [],
    files: [
      {
        id: "file-1",
        path: "src/parser.ts",
        fileDiff: { status } as FileDiff,
        hunks: [],
        additions: 0,
        deletions: 0,
        summary: null,
        fingerprint: "fingerprint-1",
        notes: [],
      },
    ],
  };
  const reviewView: ReviewView = {
    reviewAddress: { kind: "local", reviewId: "review-1" },
    data: {} as ReviewData,
    diff: [],
    steps: [stepView],
  };

  // Exercise
  const screen = await render(
    <ReviewViewProvider reviewView={reviewView}>
      <StepFileTree stepView={stepView} onFileSelect={() => undefined} />
    </ReviewViewProvider>,
    { wrapper: TestProviders },
  );

  // Verify
  await expect
    .element(screen.getByRole("treeitem", { name: /parser\.ts/ }))
    .toHaveAccessibleDescription(label);
});
