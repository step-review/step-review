import * as v from "valibot";
import formatVersion from "../data/formatVersion.ts";
import reviewDataSchema from "../data/schemas/reviewDataSchema.ts";
import type ReviewData from "../data/types/ReviewData.ts";
import formatIssuePath from "./formatIssuePath.ts";
import type ReviewFileProblem from "./ReviewFileProblem.ts";
import type Section from "./Section.ts";

export default function parseDataSection(
  section: Section,
):
  | { success: true; data: ReviewData }
  | { success: false; problems: ReviewFileProblem[] } {
  let json: unknown;
  try {
    json = JSON.parse(section.content);
  } catch (error) {
    return {
      success: false,
      problems: [
        {
          message: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
          location: `line ${section.markerLineNumber + 1}`,
        },
      ],
    };
  }
  // A review in another format version fails the schema in many places; the
  // version alone says what to do.
  if (
    typeof json === "object" &&
    json !== null &&
    "version" in json &&
    json.version !== formatVersion
  ) {
    return {
      success: false,
      problems: [
        {
          message: `The review uses format version ${JSON.stringify(json.version)}, but Step Review reads only version ${formatVersion}. Write the review again with the current instructions.`,
          location: "version",
        },
      ],
    };
  }
  const result = v.safeParse(reviewDataSchema, json);
  if (result.success) {
    return { success: true, data: result.output };
  }
  return {
    success: false,
    problems: result.issues.map((issue) => ({
      message: issue.message,
      location: formatIssuePath(issue.path) || null,
    })),
  };
}
