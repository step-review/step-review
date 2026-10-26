import type { IntlShape } from "react-intl";
import type NoteKindCounts from "../../../business-logic/review-view/NoteKindCounts.ts";

interface Counts {
  viewedCount: number;
  totalCount: number;
  noteKindCounts: NoteKindCounts;
}

/**
 * `ViewedAndNoteCounts` as plain text, e.g. for a tooltip: "1/3 viewed, 2
 * issues, 1 note".
 */
export default function formatViewedAndNoteCounts(
  intl: IntlShape,
  { viewedCount, totalCount, noteKindCounts }: Counts,
): string {
  const issueCount = Object.values(noteKindCounts.issueCountsBySeverity).reduce(
    (sum, count) => sum + count,
    0,
  );
  const { explainerCount } = noteKindCounts;
  return intl.formatList(
    [
      intl.formatMessage(
        { defaultMessage: "{viewedCount}/{totalCount} viewed" },
        { viewedCount, totalCount },
      ),
      ...(issueCount > 0
        ? [
            intl.formatMessage(
              {
                defaultMessage:
                  "{issueCount, plural, one {# issue} other {# issues}}",
              },
              { issueCount },
            ),
          ]
        : []),
      ...(explainerCount > 0
        ? [
            intl.formatMessage(
              {
                defaultMessage:
                  "{explainerCount, plural, one {# note} other {# notes}}",
              },
              { explainerCount },
            ),
          ]
        : []),
    ],
    { type: "unit" },
  );
}
