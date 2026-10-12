import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import ReviewDropzone from "./ReviewDropzone.tsx";

it("opens a file dropped outside the dropzone", async () => {
  // Setup SUT
  const screen = await render(<ReviewDropzone />, { wrapper: TestProviders });

  // Exercise
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(new File(["not a review"], "notes.step-review"));
  document.body.dispatchEvent(
    new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }),
  );

  // Verify
  await expect.element(screen.getByRole("alert")).toBeVisible();
});

it("highlights the dropzone while a file is dragged over the page", async () => {
  // Setup SUT
  const screen = await render(<ReviewDropzone />, { wrapper: TestProviders });

  // Exercise
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(new File(["not a review"], "notes.step-review"));
  document.body.dispatchEvent(
    new DragEvent("dragenter", { bubbles: true, dataTransfer }),
  );

  // Verify
  await expect
    .poll(() => screen.container.querySelector("[data-page-drag]"))
    .not.toBeNull();
});
