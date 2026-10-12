import DiffParseError from "../diff/DiffParseError.ts";
import type FileDiff from "../diff/FileDiff.ts";
import parseUnifiedDiff from "../diff/parseUnifiedDiff.ts";
import type ReviewFileProblem from "./ReviewFileProblem.ts";
import type Section from "./Section.ts";

export default function parseDiffSection(
  section: Section,
):
  | { success: true; fileDiffs: FileDiff[] }
  | { success: false; problem: ReviewFileProblem } {
  try {
    return { success: true, fileDiffs: parseUnifiedDiff(section.content) };
  } catch (error) {
    if (!(error instanceof DiffParseError)) {
      throw error;
    }
    return {
      success: false,
      problem: {
        message: error.message,
        location: `line ${section.markerLineNumber + error.lineNumber}`,
      },
    };
  }
}
