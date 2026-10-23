import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import TestProviders from "../../../test-utils/TestProviders.tsx";
import Markdown from "./Markdown.tsx";

it("shows raw HTML as text instead of rendering it", async () => {
  // Exercise
  const screen = await render(
    <Markdown>{'Hello <img src="x" onerror="alert(1)">'}</Markdown>,
    { wrapper: TestProviders },
  );

  // Verify
  expect(screen.container.querySelector("img")).toBeNull();
});

it("renders links to parts of the review with the given renderer", async () => {
  // Exercise
  const screen = await render(
    <Markdown
      renderCustomLink={(href, children) => (
        <button type="button" data-href={href}>
          {children}
        </button>
      )}
    >
      {"See [the issue](note:n12)."}
    </Markdown>,
    { wrapper: TestProviders },
  );

  // Verify
  await expect
    .element(screen.getByRole("button", { name: "the issue" }))
    .toHaveAttribute("data-href", "note:n12");
});

it("drops javascript links", async () => {
  // Exercise
  const screen = await render(
    <Markdown>{"[click](javascript:alert(1))"}</Markdown>,
    { wrapper: TestProviders },
  );

  // Verify
  expect(
    screen.container.querySelector("a")?.getAttribute("href") ?? "",
  ).not.toContain("javascript");
});
