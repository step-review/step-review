import parseDataSection from "./parseDataSection.ts";
import parseDiffSection from "./parseDiffSection.ts";
import type ParseReviewFileResult from "./ParseReviewFileResult.ts";
import type ReviewFileProblem from "./ReviewFileProblem.ts";
import type Section from "./Section.ts";
import sectionMarkerPrefix from "./sectionMarkerPrefix.ts";
import splitSections from "./splitSections.ts";

/**
 * Parses a review file: a `#step-review:review` section (JSON) followed by a
 * `#step-review:diff` section (`git diff` output).
 */
export default function parseReviewFile(text: string): ParseReviewFileResult {
  const { sections, problems } = splitSections(text);
  if (problems.length > 0) {
    return { success: false, problems };
  }
  const [reviewSection, diffSection, extraSection] = sections;
  if (!reviewSection) {
    return {
      success: false,
      problems: [
        {
          message: `The file has no \`${sectionMarkerPrefix}review\` section.`,
          location: null,
        },
      ],
    };
  }
  if (reviewSection.kind !== "review") {
    return {
      success: false,
      problems: [unexpectedSection(reviewSection, "review")],
    };
  }
  if (diffSection?.kind !== "diff") {
    return {
      success: false,
      problems: [
        diffSection
          ? unexpectedSection(diffSection, "diff")
          : {
              message: `The file has no \`${sectionMarkerPrefix}diff\` section.`,
              location: `line ${reviewSection.markerLineNumber}`,
            },
      ],
    };
  }
  if (extraSection) {
    return {
      success: false,
      problems: [
        {
          message: `Unexpected \`${sectionMarkerPrefix}${extraSection.kind}\` section after the diff.`,
          location: `line ${extraSection.markerLineNumber}`,
        },
      ],
    };
  }
  const dataResult = parseDataSection(reviewSection);
  const diffResult = parseDiffSection(diffSection);
  if (!dataResult.success || !diffResult.success) {
    return {
      success: false,
      problems: [
        ...(dataResult.success ? [] : dataResult.problems),
        ...(diffResult.success ? [] : [diffResult.problem]),
      ],
    };
  }
  return {
    success: true,
    reviewFile: { data: dataResult.data, diff: diffResult.fileDiffs },
  };
}

function unexpectedSection(
  section: Section,
  expectedKind: Section["kind"],
): ReviewFileProblem {
  return {
    message: `Expected a \`${sectionMarkerPrefix}${expectedKind}\` section, found \`${sectionMarkerPrefix}${section.kind}\`.`,
    location: `line ${section.markerLineNumber}`,
  };
}
