import type { ReviewData } from "@step-review/review-format";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type ReviewView from "../../../business-logic/review-view/ReviewView.ts";
import ReviewViewProvider from "../../../business-logic/review-view/ReviewViewProvider.tsx";
import type StepView from "../../../business-logic/review-view/StepView.ts";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import FileCard from "./FileCard.tsx";

it("starts a deleted file collapsed", async () => {
  // Setup SUT
  const stepView: StepView = {
    id: "step-1",
    number: 1,
    title: "Remove the old parser",
    attention: "normal",
    intro: null,
    notes: [],
    files: [
      {
        id: "file-1",
        path: "src/oldParser.ts",
        fileDiff: {
          path: "src/oldParser.ts",
          oldPath: null,
          status: "deleted",
          binary: false,
          hunks: [],
          additions: 0,
          deletions: 0,
        },
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
      <FileCard
        stepView={stepView}
        stepFileView={stepView.files[0]!}
        layout="unified"
        areExplainersHidden={false}
      />
    </ReviewViewProvider>,
    { wrapper: TestProviders },
  );

  // Verify
  await expect
    .element(screen.getByRole("button", { name: "Show or hide the diff" }))
    .toHaveAttribute("aria-expanded", "false");
});
