import * as v from "valibot";
import reviewRoundDataSchema from "../round/schemas/reviewRoundDataSchema.ts";
import type ReviewRoundData from "../round/types/ReviewRoundData.ts";
import formatIssuePath from "./formatIssuePath.ts";
import type ReviewFileProblem from "./ReviewFileProblem.ts";
import type Section from "./Section.ts";

export default function parseRoundSection(
  section: Section,
  roundNumber: number,
):
  | { success: true; data: ReviewRoundData }
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
          location: `round ${roundNumber} (line ${section.markerLineNumber})`,
        },
      ],
    };
  }
  const result = v.safeParse(reviewRoundDataSchema, json);
  if (result.success) {
    return { success: true, data: result.output };
  }
  return {
    success: false,
    problems: result.issues.map((issue) => {
      const path = formatIssuePath(issue.path);
      return {
        message: issue.message,
        location: `round ${roundNumber}${path ? `, ${path}` : ""}`,
      };
    }),
  };
}
