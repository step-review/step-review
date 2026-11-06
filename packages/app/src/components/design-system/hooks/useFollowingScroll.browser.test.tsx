import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import useFollowingScroll from "./useFollowingScroll.ts";

interface ScrollingListProps {
  followedItemId: string | null;
}

/** 20 items 20px tall, in a scroll area 100px tall. */
function ScrollingList({ followedItemId }: ScrollingListProps) {
  useFollowingScroll(followedItemId);
  return (
    <div data-testid="area" style={{ height: 100, overflowY: "auto" }}>
      {Array.from({ length: 20 }, (_, index) => (
        <div key={index} id={`item-${index}`} style={{ height: 20 }} />
      ))}
    </div>
  );
}

it("scrolls the area to the followed item when it changes", async () => {
  // Setup SUT
  const screen = await render(<ScrollingList followedItemId="item-0" />);

  // Exercise
  await screen.rerender(<ScrollingList followedItemId="item-10" />);

  // Verify
  const area = screen.getByTestId("area").element();
  const item = document.getElementById("item-10")!;
  await expect
    .poll(() => item.getBoundingClientRect().bottom)
    .toBeLessThanOrEqual(area.getBoundingClientRect().bottom);
  expect(item.getBoundingClientRect().top).toBeGreaterThanOrEqual(
    area.getBoundingClientRect().top,
  );
});

it("leaves the area alone when the user scrolled the previous item out of view", async () => {
  // Setup SUT
  const screen = await render(<ScrollingList followedItemId="item-0" />);
  const area = screen.getByTestId("area").element();
  area.scrollTop = 300;

  // Exercise
  await screen.rerender(<ScrollingList followedItemId="item-1" />);

  // Verify
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(area.scrollTop).toBe(300);
});
