import type NavigableRoute from "../navigation/NavigableRoute.ts";
import RouteName from "../navigation/RouteName.ts";
import type NoteLocation from "./NoteLocation.ts";
import type RoundView from "./RoundView.ts";

/**
 * Resolves a link to a part of the review (`note:<id>`, `step:<id>` or
 * `file:<path>`) to a route and the element to scroll to.
 */
export default function resolveReviewLink(
  href: string,
  roundView: RoundView,
  noteIndex: Map<string, NoteLocation>,
): { route: NavigableRoute; fragment: string | null } | null {
  const separatorIndex = href.indexOf(":");
  const scheme = href.slice(0, separatorIndex);
  const target = decodeURIComponent(href.slice(separatorIndex + 1));
  const roundNumber = roundView.round.number;
  switch (scheme) {
    case "note": {
      const noteLocation = noteIndex.get(target);
      return noteLocation
        ? {
            route: {
              name: RouteName.Step,
              roundNumber: noteLocation.roundNumber,
              stepId: noteLocation.stepId,
            },
            fragment: `note-${target}`,
          }
        : null;
    }
    case "step":
      return roundView.steps.some((step) => step.id === target)
        ? {
            route: { name: RouteName.Step, roundNumber, stepId: target },
            fragment: null,
          }
        : null;
    case "file": {
      for (const step of roundView.steps) {
        const file = step.files.find((stepFile) => stepFile.path === target);
        if (file) {
          return {
            route: { name: RouteName.Step, roundNumber, stepId: step.id },
            fragment: `file-${file.id}`,
          };
        }
      }
      return null;
    }
    default:
      return null;
  }
}
