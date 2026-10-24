import { expect, it } from "vitest";
import countNotes from "./countNotes.ts";

it("counts issues by severity and explainers separately", () => {
  // Exercise
  const noteKindCounts = countNotes([
    { id: "n1", kind: "explainer", body: "Why the order changed." },
    {
      id: "n2",
      kind: "issue",
      severity: "concern",
      body: "This can overflow.",
    },
    { id: "n3", kind: "explainer", body: "Renamed for clarity." },
    { id: "n4", kind: "issue", severity: "nit", body: "Typo." },
    { id: "n5", kind: "issue", severity: "concern", body: "Races on reload." },
  ]);

  // Verify
  expect(noteKindCounts).toEqual({
    issueCountsBySeverity: { blocker: 0, concern: 2, question: 0, nit: 1 },
    explainerCount: 2,
  });
});
