import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import ReviewDropzone from "./ReviewDropzone.tsx";

it("shows the drop overlay while a file is dragged over the page", async () => {
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
    .element(screen.getByText("Drop the review file to open it"))
    .toBeVisible();
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
  screen
    .getByText("Drop the review file to open it")
    .element()
    .dispatchEvent(
      new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }),
    );

  // Verify
  await expect
    .element(
      screen.getByRole("region", { name: "The file is not a valid review" }),
    )
    .toBeVisible();
});

it("copies a prompt that asks the agent to fix the file's problems", async () => {
  // Setup mocks
  const writeText = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue();

  // Setup SUT
  const screen = await render(<ReviewDropzone />, { wrapper: TestProviders });

  // Exercise
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(new File(["not a review"], "notes.step-review"));
  document.body.dispatchEvent(
    new DragEvent("dragenter", { bubbles: true, dataTransfer }),
  );
  screen
    .getByText("Drop the review file to open it")
    .element()
    .dispatchEvent(
      new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }),
    );
  await screen.getByRole("button", { name: "Copy for your agent" }).click();

  // Verify
  expect(writeText).toHaveBeenCalledWith(
    [
      "The review file `notes.step-review` has these problems:",
      "- line 1: The file must start with a `#step-review:review` line.",
      "",
      `Fix them and write the review again, following ${window.location.origin}/SKILL.md.`,
    ].join("\n"),
  );
});

it("opens a file launched from the operating system", async () => {
  // Setup mocks
  let launchConsumer: ((launchParams: LaunchParams) => void) | undefined;
  vi.stubGlobal("launchQueue", {
    setConsumer: (consumer: (launchParams: LaunchParams) => void) => {
      launchConsumer = consumer;
    },
  });

  // Setup SUT
  const screen = await render(<ReviewDropzone />, { wrapper: TestProviders });

  // Exercise
  const file = new File(["not a review"], "notes.step-review");
  launchConsumer?.({
    files: [{ getFile: async () => file } as FileSystemFileHandle],
  });

  // Verify
  await expect
    .element(
      screen.getByRole("region", { name: "The file is not a valid review" }),
    )
    .toBeVisible();
});
