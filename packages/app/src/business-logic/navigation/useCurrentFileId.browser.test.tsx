import type { FileDiff } from "@step-review/review-format";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type StepFileView from "../review-view/StepFileView.ts";
import FragmentScroll from "./FragmentScroll.ts";
import useCurrentFileId from "./useCurrentFileId.ts";

interface FileCardsProps {
  stepFileViews: StepFileView[];
  /** The height of each file's card, in the files' order. */
  cardHeights: number[];
}

/** Stands in for a step's file cards, showing the current file's ID. */
function FileCards({ stepFileViews, cardHeights }: FileCardsProps) {
  const currentFileId = useCurrentFileId(stepFileViews);
  return (
    <>
      <output data-testid="current-file">{currentFileId ?? "none"}</output>
      {stepFileViews.map((stepFileView, index) => (
        <div
          key={stepFileView.id}
          id={`file-${stepFileView.id}`}
          style={{ height: cardHeights[index] }}
        >
          {stepFileView.notes.map((note) => (
            <div key={note.id} id={`note-${note.id}`} />
          ))}
        </div>
      ))}
    </>
  );
}

it("returns the file a link scrolled to, even when the page can't bring its card to the top", async () => {
  // Setup SUT
  const stepFileViews: StepFileView[] = [
    {
      id: "long",
      path: "src/parser.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-1",
      notes: [],
    },
    {
      id: "short",
      path: "src/lexer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-2",
      notes: [],
    },
  ];
  const screen = await render(
    <FileCards stepFileViews={stepFileViews} cardHeights={[3000, 50]} />,
  );

  // Exercise
  FragmentScroll.scrollTo("file-short");

  // Verify
  await expect
    .element(screen.getByTestId("current-file"))
    .toHaveTextContent("short");
});

it("returns the file holding the note a link scrolled to", async () => {
  // Setup SUT
  const stepFileViews: StepFileView[] = [
    {
      id: "long",
      path: "src/parser.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-1",
      notes: [],
    },
    {
      id: "short",
      path: "src/lexer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-2",
      notes: [{ id: "note-1", kind: "explainer", body: "Why." }],
    },
  ];
  const screen = await render(
    <FileCards stepFileViews={stepFileViews} cardHeights={[3000, 50]} />,
  );

  // Exercise
  FragmentScroll.scrollTo("note-note-1");

  // Verify
  await expect
    .element(screen.getByTestId("current-file"))
    .toHaveTextContent("short");
});

it("returns the file at the top once the page scrolls on from where a link left it", async () => {
  // Setup SUT
  const stepFileViews: StepFileView[] = [
    {
      id: "long",
      path: "src/parser.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-1",
      notes: [],
    },
    {
      id: "short",
      path: "src/lexer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-2",
      notes: [],
    },
  ];
  const screen = await render(
    <FileCards stepFileViews={stepFileViews} cardHeights={[3000, 50]} />,
  );
  FragmentScroll.scrollTo("file-short");
  await expect
    .element(screen.getByTestId("current-file"))
    .toHaveTextContent("short");

  // Exercise
  window.scrollBy(0, -100);

  // Verify
  await expect
    .element(screen.getByTestId("current-file"))
    .toHaveTextContent("long");
});
