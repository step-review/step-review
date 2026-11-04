import type { ReviewData } from "@step-review/review-format";
import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import type StepFileView from "../../../business-logic/review-view/StepFileView.ts";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import FileCardHeader from "./FileCardHeader.tsx";

it("keeps the Viewed checkbox beside a path too long to fit", async () => {
  // Setup SUT
  const path = `packages/${"very-long-directory-name/".repeat(20)}file.ts`;
  const stepFileView: StepFileView = {
    id: "file-1",
    path,
    fileDiff: {
      path,
      oldPath: null,
      status: "modified",
      binary: false,
      hunks: [],
      additions: 2,
      deletions: 0,
    },
    hunks: [],
    additions: 2,
    deletions: 0,
    summary: null,
    fingerprint: "fingerprint-1",
    notes: [],
  };
  const reviewView: ReviewView = {
    reviewAddress: { kind: "local", reviewId: "review-1" },
    data: {} as ReviewData,
    diff: [],
    steps: [],
  };

  // Exercise
  const screen = await render(
    <ReviewViewProvider reviewView={reviewView}>
      <div style={{ width: "800px" }}>
        <FileCardHeader
          stepFileView={stepFileView}
          isCollapsed={false}
          isViewed={false}
          onToggleCollapsed={vi.fn()}
          onViewedChange={vi.fn()}
        />
      </div>
    </ReviewViewProvider>,
    { wrapper: TestProviders },
  );

  // Verify
  const collapseButtonBox = screen
    .getByRole("button", { name: "Show or hide the diff" })
    .element()
    .getBoundingClientRect();
  const viewedCheckboxBox = screen
    .getByRole("checkbox", { name: "Viewed" })
    .element()
    .getBoundingClientRect();
  expect(viewedCheckboxBox.top).toBeLessThan(collapseButtonBox.bottom);
});
