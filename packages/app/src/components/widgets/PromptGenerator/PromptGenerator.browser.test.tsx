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

it("saves an edited prompt template and puts it in the prompt", async () => {
  // Setup SUT
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Exercise
  await screen
    .getByRole("button", { name: "Edit the prompt template" })
    .click();
  await screen
    .getByRole("textbox", { name: "Prompt template" })
    .fill("Review PR_LINK_HERE step by step.");
  await screen.getByRole("button", { name: "Save" }).click();

  // Verify
  await expect
    .element(
      screen.getByRole("textbox", { name: "Prompt for your coding agent" }),
    )
    .toHaveValue("Review PR_LINK_HERE step by step.");
  expect(window.localStorage.getItem(promptTemplateStorageKey)).toBe(
    "Review PR_LINK_HERE step by step.",
  );
});

it("selects the PR placeholder after saving an edited prompt template", async () => {
  // Setup SUT
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Exercise
  await screen
    .getByRole("button", { name: "Edit the prompt template" })
    .click();
  await screen
    .getByRole("textbox", { name: "Prompt template" })
    .fill("Please review PR_LINK_HERE.");
  await screen.getByRole("button", { name: "Save" }).click();

  // Verify
  const textarea = screen
    .getByRole("textbox", { name: "Prompt for your coding agent" })
    .element() as HTMLTextAreaElement;
  await expect.poll(() => document.activeElement).toBe(textarea);
  expect(
    textarea.value.slice(textarea.selectionStart, textarea.selectionEnd),
  ).toBe("PR_LINK_HERE");
});

it("forgets the saved prompt template when the default is restored", async () => {
  // Setup SUT
  window.localStorage.setItem(
    promptTemplateStorageKey,
    "Review PR_LINK_HERE step by step.",
  );
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Exercise
  await screen
    .getByRole("button", { name: "Edit the prompt template" })
    .click();
  await screen.getByRole("button", { name: "Restore default" }).click();
  await screen.getByRole("button", { name: "Save" }).click();

  // Verify
  await expect
    .element(
      screen.getByRole("textbox", { name: "Prompt for your coding agent" }),
    )
    .toHaveValue(
      `Review PR_LINK_HERE with ${window.location.origin}/SKILL.md.`,
    );
  expect(window.localStorage.getItem(promptTemplateStorageKey)).toBeNull();
});

it("keeps the prompt unchanged when editing the prompt template is canceled", async () => {
  // Setup SUT
  const screen = await render(<PromptGenerator />, { wrapper: TestProviders });

  // Exercise
  await screen
    .getByRole("button", { name: "Edit the prompt template" })
    .click();
  await screen
    .getByRole("textbox", { name: "Prompt template" })
    .fill("Review PR_LINK_HERE step by step.");
  await screen.getByRole("button", { name: "Cancel" }).click();

  // Verify
  await expect
    .element(
      screen.getByRole("textbox", { name: "Prompt for your coding agent" }),
    )
    .toHaveValue(
      `Review PR_LINK_HERE with ${window.location.origin}/SKILL.md.`,
    );
  expect(window.localStorage.getItem(promptTemplateStorageKey)).toBeNull();
});

it("hides the prompt template editing from the non-editable prompt", async () => {
  // Exercise
  const screen = await render(<PromptGenerator editable={false} />, {
    wrapper: TestProviders,
  });

  // Verify
  expect(
    screen.getByRole("button", { name: "Edit the prompt template" }).query(),
  ).toBeNull();
});
