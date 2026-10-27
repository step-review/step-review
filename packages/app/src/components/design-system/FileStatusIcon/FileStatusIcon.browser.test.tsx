import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import FileStatusIcon from "./FileStatusIcon.tsx";

function measureDrawing(container: HTMLElement) {
  const svg = container.querySelector("svg")!;
  const { x, y, width, height } = svg.getBBox();
  const { width: renderedWidth, height: renderedHeight } =
    svg.getBoundingClientRect();
  return { x, y, width, height, renderedWidth, renderedHeight };
}

it.each(["deleted", "modified"] as const)(
  "draws the %s icon exactly as large as the added icon",
  async (status) => {
    // Setup SUT
    const addedScreen = await render(<FileStatusIcon status="added" />);

    // Exercise
    const statusScreen = await render(<FileStatusIcon status={status} />);

    // Verify
    expect(measureDrawing(statusScreen.container)).toEqual(
      measureDrawing(addedScreen.container),
    );
  },
);
