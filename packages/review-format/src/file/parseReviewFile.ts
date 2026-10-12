import type FileDiff from "../diff/FileDiff.ts";
import parseDiffSection from "./parseDiffSection.ts";
import type ParseReviewFileResult from "./ParseReviewFileResult.ts";
import parseRoundSection from "./parseRoundSection.ts";
import type ReviewFileProblem from "./ReviewFileProblem.ts";
import type ReviewRound from "./ReviewRound.ts";
import type Section from "./Section.ts";
import sectionMarkerPrefix from "./sectionMarkerPrefix.ts";
import splitSections from "./splitSections.ts";

/**
 * Parses a review file: a sequence of rounds, each made of a
 * `#step-review:round` section (JSON), a `#step-review:diff` section and an
 * optional `#step-review:interdiff` section (both `git diff` output).
 */
export default function parseReviewFile(text: string): ParseReviewFileResult {
  const { sections, problems } = splitSections(text);
  if (problems.length > 0) {
    return { success: false, problems };
  }
  if (sections.length === 0) {
    return {
      success: false,
      problems: [
        {
          message: `The file has no \`${sectionMarkerPrefix}round\` section.`,
          location: null,
        },
      ],
    };
  }
  const rounds: ReviewRound[] = [];
  let index = 0;
  let roundNumber = 0;
  while (index < sections.length) {
    roundNumber++;
    const roundSection = sections[index]!;
    const diffSection = sections[index + 1];
    const interdiffSection =
      sections[index + 2]?.kind === "interdiff" ? sections[index + 2] : null;
    if (roundSection.kind !== "round") {
      problems.push(
        unexpectedSection(roundSection, `${sectionMarkerPrefix}round`),
      );
      break;
    }
    if (diffSection?.kind !== "diff") {
      problems.push(
        diffSection
          ? unexpectedSection(diffSection, `${sectionMarkerPrefix}diff`)
          : {
              message: `Round ${roundNumber} has no \`${sectionMarkerPrefix}diff\` section.`,
              location: `line ${roundSection.markerLineNumber}`,
            },
      );
      break;
    }
    const roundResult = parseRoundSection(roundSection, roundNumber);
    const diff = parseDiff(diffSection, problems);
    const interdiff = interdiffSection
      ? parseDiff(interdiffSection, problems)
      : null;
    if (!roundResult.success) {
      problems.push(...roundResult.problems);
    } else if (diff) {
      rounds.push({
        number: roundNumber,
        data: roundResult.data,
        diff,
        interdiff,
      });
    }
    index += interdiffSection ? 3 : 2;
  }
  return problems.length > 0
    ? { success: false, problems }
    : { success: true, reviewFile: { rounds } };
}

function parseDiff(
  section: Section,
  problems: ReviewFileProblem[],
): FileDiff[] | null {
  const result = parseDiffSection(section);
  if (!result.success) {
    problems.push(result.problem);
    return null;
  }
  return result.fileDiffs;
}

function unexpectedSection(
  section: Section,
  expectedMarker: string,
): ReviewFileProblem {
  return {
    message: `Expected a \`${expectedMarker}\` section, found \`${sectionMarkerPrefix}${section.kind}\`.`,
    location: `line ${section.markerLineNumber}`,
  };
}
