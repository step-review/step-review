import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import ReviewDropzone from "./ReviewDropzone.tsx";

it("shows the drop overlay while a file is dragged over the page", async () => {
  // Setup SUT
  await render(<ReviewDropzone />, { wrapper: TestProviders });

  // Exercise
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(new File(["not a review"], "notes.step-review"));
  document.body.dispatchEvent(
    new DragEvent("dragenter", { bubbles: true, dataTransfer }),
  );

  // Verify
  await expect
    .poll(
      () =>
        document.querySelector<HTMLElement>(
          ".mantine-DropzoneFullScreen-fullScreen",
        )?.style.opacity,
    )
    .toBe("1");
});

it("opens a file dropped on the page", async () => {
  // Setup SUT
  const screen = await render(<ReviewDropzone />, { wrapper: TestProviders });

  // Exercise
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(new File(["not a review"], "notes.step-review"));
  document.body.dispatchEvent(
    new DragEvent("dragenter", { bubbles: true, dataTransfer }),
  );
  document
    .querySelector(".mantine-Dropzone-root")!
    .dispatchEvent(
      new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }),
    );

  // Verify
  await expect.element(screen.getByRole("alert")).toBeVisible();
});
