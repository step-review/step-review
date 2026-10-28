import { afterEach, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import hasAddedReview from "../../../business-logic/review-store/hasAddedReview.ts";
import useStoredReviews from "../../../business-logic/review-store/useStoredReviews.ts";
import useSessionBookmarks from "../../../business-logic/session-store/useSessionBookmarks.ts";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import Start from "./Start.tsx";

vi.mock("../../../business-logic/review-store/hasAddedReview.ts");
vi.mock("../../../business-logic/review-store/useStoredReviews.ts");
vi.mock("../../../business-logic/session-store/useSessionBookmarks.ts");

afterEach(() => {
  vi.resetAllMocks();
});

it.each([1024, 375])(
  "keeps the footer below the new-user steps in a short viewport at %i pixels wide",
  async (width) => {
    // Setup mocks
    vi.mocked(useStoredReviews).mockReturnValue([]);
    vi.mocked(useSessionBookmarks).mockReturnValue([]);

    // Exercise
    await page.viewport(width, 350);
    const screen = await render(<Start />, { wrapper: TestProviders });
    const finalHeading = screen
      .getByRole("heading", { name: /3\. Go through the PR/u })
      .element();
    const footer = screen.getByRole("contentinfo").element();

    // Verify
    expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      finalHeading.getBoundingClientRect().bottom,
    );
  },
);

it("keeps the footer below saved reviews in a short viewport", async () => {
  // Setup mocks
  vi.mocked(useSessionBookmarks).mockReturnValue([]);

  // Exercise
  vi.mocked(useStoredReviews).mockReturnValue([
    {
      reviewId: "review-1",
      title: "Review changes",
      fileName: "changes.step-review",
      openedAt: 1,
    },
  ]);
  await page.viewport(1024, 250);
  const screen = await render(<Start />, { wrapper: TestProviders });
  const reviewLink = screen
    .getByRole("link", { name: "Review changes" })
    .element();
  const footer = screen.getByRole("contentinfo").element();

  // Verify
  expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
    reviewLink.getBoundingClientRect().bottom,
  );
});

it("scrolls to the footer when the new-user page is shorter than its content", async () => {
  // Setup mocks
  vi.mocked(useStoredReviews).mockReturnValue([]);
  vi.mocked(useSessionBookmarks).mockReturnValue([]);

  // Setup SUT
  await page.viewport(1024, 350);
  const screen = await render(<Start />, { wrapper: TestProviders });
  const footer = screen.getByRole("contentinfo").element();

  // Exercise
  footer.scrollIntoView({ block: "end" });

  // Verify
  expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
  expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(
    window.innerHeight,
  );
});

it("keeps the new-user steps hidden after the added reviews are removed", async () => {
  // Setup mocks
  vi.mocked(useStoredReviews).mockReturnValue([]);
  vi.mocked(useSessionBookmarks).mockReturnValue([]);
  vi.mocked(hasAddedReview).mockReturnValue(true);

  // Exercise
  const screen = await render(<Start />, { wrapper: TestProviders });

  // Verify
  await expect
    .element(screen.getByRole("heading", { name: "Past reviews" }))
    .toBeVisible();
  await expect
    .element(screen.getByText("The reviews you open are kept here."))
    .toBeVisible();
  expect(
    screen.getByRole("heading", { name: /Give this prompt/u }).query(),
  ).toBeNull();
});
