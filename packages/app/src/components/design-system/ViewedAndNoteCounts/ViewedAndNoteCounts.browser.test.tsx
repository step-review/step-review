import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import ViewedAndNoteCounts from "./ViewedAndNoteCounts.tsx";

it("is as wide with one file viewed as with every file viewed", async () => {
  // Exercise
  const screen = await render(
    <>
      <div style={{ display: "flex" }} data-testid="one-viewed">
        <ViewedAndNoteCounts
          viewedCount={1}
          totalCount={10}
          noteKindCounts={{
            issueCountsBySeverity: {
              blocker: 0,
              concern: 0,
              question: 0,
              nit: 0,
            },
            explainerCount: 0,
          }}
        />
      </div>
      <div style={{ display: "flex" }} data-testid="all-viewed">
        <ViewedAndNoteCounts
          viewedCount={10}
          totalCount={10}
          noteKindCounts={{
            issueCountsBySeverity: {
              blocker: 0,
              concern: 0,
              question: 0,
              nit: 0,
            },
            explainerCount: 0,
          }}
        />
      </div>
    </>,
    { wrapper: TestProviders },
  );

  // Verify
  const oneViewedWidth = screen
    .getByTestId("one-viewed")
    .getByText("1/10 viewed")
    .element()
    .parentElement!.getBoundingClientRect().width;
  const allViewedWidth = screen
    .getByTestId("all-viewed")
    .getByText("10/10 viewed", { exact: true })
    .first()
    .element()
    .parentElement!.getBoundingClientRect().width;
  expect(oneViewedWidth).toBe(allViewedWidth);
});
