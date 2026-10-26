import sectionMarkerPrefix from "./sectionMarkerPrefix.ts";

/**
 * Writes a review file from the review's data and the output of `git diff`.
 * Serializing the data keeps every JSON string on one line, so no line of it
 * can be taken for a section marker.
 */
export default function createReviewFileText(
  data: unknown,
  diffText: string,
): string {
  return [
    `${sectionMarkerPrefix}review`,
    JSON.stringify(data, null, 2),
    `${sectionMarkerPrefix}diff`,
    diffText,
  ].join("\n");
}
