import * as v from "valibot";
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
