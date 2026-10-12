import type RoundView from "../rounds/RoundView.ts";
import type SearchEntry from "./SearchEntry.ts";

/** Entries of the quick-jump search for one round. */
export default function createSearchEntries(
  roundView: RoundView,
  unassignedStepTitle: string,
): SearchEntry[] {
  return roundView.steps.flatMap((step) => {
    const stepTitle = step.title ?? unassignedStepTitle;
    return [
      {
        id: `step:${step.id}`,
        kind: "step" as const,
        label: `${step.number}. ${stepTitle}`,
        description: step.intro ?? "",
        stepId: step.id,
        fragment: null,
      },
      ...step.notes.map((note) => ({
        id: `note:${note.id}`,
        kind: "note" as const,
        label: `${note.id} · ${stepTitle}`,
        description: note.body,
        stepId: step.id,
        fragment: `note-${note.id}`,
      })),
      ...step.files.flatMap((file) => [
        {
          id: `file:${file.id}`,
          kind: "file" as const,
          label: file.path,
          description: `${step.number}. ${stepTitle}`,
          stepId: step.id,
          fragment: `file-${file.id}`,
        },
        ...file.notes.map((note) => ({
          id: `note:${note.id}`,
          kind: "note" as const,
          label: `${note.id} · ${file.path}`,
          description: note.body,
          stepId: step.id,
          fragment: `note-${note.id}`,
        })),
      ]),
    ];
  });
}
