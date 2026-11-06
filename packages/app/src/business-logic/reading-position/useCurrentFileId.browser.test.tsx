import type { FileDiff } from "@step-review/review-format";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import FragmentScroll from "../navigation/FragmentScroll.ts";
import type StepFileView from "../review-view/StepFileView.ts";
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

it("returns the file a link scrolled to, even when the page can't bring its card to the reading line", async () => {
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
      id: "middle",
      path: "src/lexer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-2",
      notes: [],
    },
    {
      id: "last",
      path: "src/printer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-3",
      notes: [],
    },
  ];
  const screen = await render(
    <FileCards stepFileViews={stepFileViews} cardHeights={[3000, 50, 50]} />,
  );

  // Exercise
  FragmentScroll.scrollTo("file-middle");

  // Verify
  await expect
    .element(screen.getByTestId("current-file"))
    .toHaveTextContent("middle");
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
      id: "middle",
      path: "src/lexer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-2",
      notes: [{ id: "note-1", kind: "explainer", body: "Why." }],
    },
    {
      id: "last",
      path: "src/printer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-3",
      notes: [],
    },
  ];
  const screen = await render(
    <FileCards stepFileViews={stepFileViews} cardHeights={[3000, 50, 50]} />,
  );

  // Exercise
  FragmentScroll.scrollTo("note-note-1");

  // Verify
  await expect
    .element(screen.getByTestId("current-file"))
    .toHaveTextContent("middle");
});

it("returns the file being read once the page scrolls on from where a link left it", async () => {
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
      id: "middle",
      path: "src/lexer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-2",
      notes: [],
    },
    {
      id: "last",
      path: "src/printer.ts",
      fileDiff: { status: "modified" } as FileDiff,
      hunks: [],
      additions: 1,
      deletions: 0,
      summary: null,
      fingerprint: "fingerprint-3",
      notes: [],
    },
  ];
  const screen = await render(
    <FileCards stepFileViews={stepFileViews} cardHeights={[3000, 50, 50]} />,
  );
  FragmentScroll.scrollTo("file-middle");
  await expect
    .element(screen.getByTestId("current-file"))
    .toHaveTextContent("middle");

  // Exercise
  window.scrollBy(0, -100);

  // Verify
  await expect
    .element(screen.getByTestId("current-file"))
    .toHaveTextContent("long");
});
