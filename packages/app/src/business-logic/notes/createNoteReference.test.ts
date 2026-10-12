import { expect, it } from "vitest";
import createNoteReference from "./createNoteReference.ts";

it("includes the note ID, the file and line, and the note text", () => {
  // Exercise
  const noteReference = createNoteReference("pr-7.step-review", {
    note: {
      id: "n3",
      kind: "issue",
      severity: "concern",
      anchor: { side: "new", line: 12, endLine: 14 },
      body: "This can overflow.",
    },
    roundNumber: 2,
    stepId: "sum",
    path: "src/sum.ts",
  });

  // Verify
  expect(noteReference).toBe(
    "Issue (concern) `n3` from `pr-7.step-review` (round 2), on `src/sum.ts:12-14`:\n\nThis can overflow.",
  );
});

it("refers to the step for a step note", () => {
  // Exercise
  const noteReference = createNoteReference("pr-7.step-review", {
    note: { id: "n1", kind: "explainer", body: "Order of the changes." },
    roundNumber: 1,
    stepId: "sum",
    path: null,
  });

  // Verify
  expect(noteReference).toBe(
    "Note `n1` from `pr-7.step-review` (round 1), on step `sum`:\n\nOrder of the changes.",
  );
});
