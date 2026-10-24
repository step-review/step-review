import { afterEach, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import PromptGenerator from "./PromptGenerator.tsx";

afterEach(() => {
  vi.restoreAllMocks();
});

it("shows the skill link without its protocol while keeping the full URL as its target", async () => {
  // Exercise
  const screen = await render(<PromptGenerator editable={false} />, {
    wrapper: TestProviders,
  });
  const skillUrl = `${window.location.origin}/SKILL.md`;
  const skillLinkText = `${window.location.host}/SKILL.md`;

  // Verify
  expect(screen.container.querySelector("textarea")).toBeNull();
  await expect
    .element(screen.getByRole("link", { name: skillLinkText }))
    .toHaveAttribute("href", skillUrl);
  await expect
    .element(screen.getByRole("link", { name: skillLinkText }))
    .toHaveAttribute("target", "_blank");
});

it("shows the non-editable placeholder in italics with a dollar sign", async () => {
  // Exercise
  const screen = await render(<PromptGenerator editable={false} />, {
    wrapper: TestProviders,
  });

  // Verify
  await expect
    .element(screen.getByText("$PR_LINK_HERE"))
    .toHaveStyle({ fontStyle: "italic" });
});

it("copies the non-editable prompt with a plain placeholder and the skill URL", async () => {
  // Setup mocks
  const writeText = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue();

  // Setup SUT
  const screen = await render(<PromptGenerator editable={false} />, {
    wrapper: TestProviders,
  });

  // Exercise
  const expectedPrompt = `Review PR_LINK_HERE with ${window.location.origin}/SKILL.md.`;
  await screen.getByRole("button", { name: "Copy the prompt" }).click();

  // Verify
  expect(writeText).toHaveBeenCalledWith(expectedPrompt);
});

it("selects the PR placeholder in the editable prompt", async () => {
  // Exercise
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });
  const textarea = screen
    .getByRole("textbox", {
      name: "Prompt for your coding agent",
    })
    .element() as HTMLTextAreaElement;

  // Verify
  expect(document.activeElement).toBe(textarea);
  expect(
    textarea.value.slice(textarea.selectionStart, textarea.selectionEnd),
  ).toBe("PR_LINK_HERE");
});
