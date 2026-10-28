import { afterEach, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import promptTemplateStorageKey from "../../../business-logic/prompts/promptTemplateStorageKey.ts";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import PromptGenerator from "./PromptGenerator.tsx";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.removeItem(promptTemplateStorageKey);
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

it("keeps the editable prompt's height when a long link is entered", async () => {
  // Setup SUT
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });
  const textarea = screen.getByRole("textbox", {
    name: "Prompt for your coding agent",
  });
  const initialHeight = textarea.element().getBoundingClientRect().height;

  // Exercise
  await textarea.fill(
    "Review https://github.com/example-organization/example-repository/pull/12345 with https://step-review.dev/SKILL.md.",
  );

  // Verify
  expect(textarea.element().getBoundingClientRect().height).toBe(initialHeight);
});

it("starts the editable prompt from the saved prompt template", async () => {
  // Setup SUT
  window.localStorage.setItem(
    promptTemplateStorageKey,
    "Review PR_LINK_HERE step by step.",
  );

  // Exercise
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Verify
  await expect
    .element(
      screen.getByRole("textbox", { name: "Prompt for your coding agent" }),
    )
    .toHaveValue("Review PR_LINK_HERE step by step.");
});

it("saves the edited prompt as the prompt template", async () => {
  // Setup SUT
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Exercise
  await screen
    .getByRole("textbox", { name: "Prompt for your coding agent" })
    .fill("Review PR_LINK_HERE step by step.");
  await screen.getByRole("button", { name: "Save as template" }).click();

  // Verify
  expect(window.localStorage.getItem(promptTemplateStorageKey)).toBe(
    "Review PR_LINK_HERE step by step.",
  );
});

it("selects the PR placeholder after saving the prompt as the template", async () => {
  // Setup SUT
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });
  const textarea = screen.getByRole("textbox", {
    name: "Prompt for your coding agent",
  });

  // Exercise
  await textarea.fill("Please review PR_LINK_HERE.");
  await screen.getByRole("button", { name: "Save as template" }).click();

  // Verify
  const textareaElement = textarea.element() as HTMLTextAreaElement;
  await expect.poll(() => document.activeElement).toBe(textareaElement);
  expect(
    textareaElement.value.slice(
      textareaElement.selectionStart,
      textareaElement.selectionEnd,
    ),
  ).toBe("PR_LINK_HERE");
});

it("forgets the saved prompt template when the default prompt is saved as the template", async () => {
  // Setup SUT
  window.localStorage.setItem(
    promptTemplateStorageKey,
    "Review PR_LINK_HERE step by step.",
  );
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Exercise
  await screen
    .getByRole("textbox", { name: "Prompt for your coding agent" })
    .fill(`Review PR_LINK_HERE with ${window.location.origin}/SKILL.md.`);
  await screen.getByRole("button", { name: "Save as template" }).click();

  // Verify
  expect(window.localStorage.getItem(promptTemplateStorageKey)).toBeNull();
});

it("explains that the template needs the PR placeholder when the prompt doesn't contain it", async () => {
  // Setup SUT
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Exercise
  await screen
    .getByRole("textbox", { name: "Prompt for your coding agent" })
    .fill("Review https://github.com/example/repository/pull/1.");

  // Verify
  const saveButton = screen.getByRole("button", { name: "Save as template" });
  await expect.element(saveButton).toHaveAttribute("aria-disabled", "true");
  await expect
    .element(saveButton)
    .toHaveAccessibleDescription("The template needs to contain PR_LINK_HERE");
});

it("doesn't save a prompt without the PR placeholder as the template", async () => {
  // Setup SUT
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Exercise
  await screen
    .getByRole("textbox", { name: "Prompt for your coding agent" })
    .fill("Review https://github.com/example/repository/pull/1.");
  await screen
    .getByRole("button", { name: "Save as template" })
    .click({ force: true });

  // Verify
  expect(window.localStorage.getItem(promptTemplateStorageKey)).toBeNull();
});

it("hides saving as template from the non-editable prompt", async () => {
  // Exercise
  const screen = await render(<PromptGenerator editable={false} />, {
    wrapper: TestProviders,
  });

  // Verify
  expect(
    screen.getByRole("button", { name: "Save as template" }).query(),
  ).toBeNull();
});

it("shows all of a saved prompt template that wraps over several lines", async () => {
  // Setup SUT
  window.localStorage.setItem(
    promptTemplateStorageKey,
    "Review PR_LINK_HERE step by step, focusing on the security implications of every change, and keep each step small enough to read in a minute.",
  );

  // Exercise
  const screen = await render(
    <div style={{ width: 360 }}>
      <PromptGenerator />
    </div>,
    { wrapper: TestProviders },
  );

  // Verify
  const textarea = screen
    .getByRole("textbox", { name: "Prompt for your coding agent" })
    .element();
  expect(textarea.scrollHeight).toBeLessThanOrEqual(textarea.clientHeight);
});
